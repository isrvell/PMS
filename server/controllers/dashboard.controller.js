import { Op } from "sequelize";
import { Project, Task, TaskMember, Activity, User } from "../models/index.js";

export const getDashboard = async (req, res, next) => {
  try {
    const workspaceId = req.workspace.id;
    const userId = req.user.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    const [
      activeProjects,
      totalTasks,
      completedTasks,
      upcomingDeadlineCount,
      tasksDueToday,
      recentActivities,
      upcomingDeadlines,
      projects,
    ] = await Promise.all([
      Project.count({ where: { workspaceId, status: "active" } }),
      Task.count({ where: { workspaceId } }),
      Task.count({ where: { workspaceId, status: "done" } }),
      Task.count({ where: { workspaceId, dueDate: { [Op.between]: [now, oneWeekFromNow] } } }),
      Task.count({ where: { workspaceId, dueDate: { [Op.between]: [todayStart, todayEnd] } } }),
      Activity.findAll({
        where: { workspaceId },
        include: [{ model: User, as: "user", attributes: ["name", "avatar"] }],
        order: [["createdAt", "DESC"]],
        limit: 10,
      }),
      Task.findAll({
        where: { workspaceId, dueDate: { [Op.between]: [now, oneWeekFromNow] } },
        include: [{ model: Project, as: "project", attributes: ["name"] }],
        order: [["dueDate", "ASC"]],
        limit: 5,
      }),
      Project.findAll({ where: { workspaceId } }),
    ]);

    const userTaskIds = (await TaskMember.findAll({ where: { userId } })).map((tm) => tm.taskId);
    const actionRequired = userTaskIds.length ? await Task.findAll({
      where: {
        id: userTaskIds,
        workspaceId,
        status: { [Op.ne]: "done" },
        dueDate: { [Op.lte]: oneWeekFromNow },
      },
      order: [["dueDate", "ASC"]],
      limit: 5,
    }) : [];

    const statusCounts = { "In Progress": 0, Completed: 0, Pending: 0 };
    for (const p of projects) {
      if (p.status === "active") statusCounts["In Progress"]++;
      else if (p.status === "completed") statusCounts["Completed"]++;
      else statusCounts["Pending"]++;
    }
    const total = projects.length || 1;
    const projectProgress = [
      { id: "In Progress", value: Math.round((statusCounts["In Progress"] / total) * 100), color: "#F59E0B" },
      { id: "Completed", value: Math.round((statusCounts["Completed"] / total) * 100), color: "#22C55E" },
      { id: "Pending", value: Math.round((statusCounts["Pending"] / total) * 100), color: "#EF4444" },
    ];

    const stats = [
      { id: 1, icon: "bi bi-kanban", value: activeProjects, title: "Active Projects" },
      { id: 2, icon: "bi bi-list-check", value: totalTasks, title: "Total Tasks" },
      { id: 3, icon: "bi bi-check-circle", value: completedTasks, title: "Completed Tasks" },
      { id: 4, icon: "bi bi-calendar-event", value: upcomingDeadlineCount, title: "Upcoming Deadlines" },
    ];

    const welcome = {
      greeting: getGreeting(),
      name: req.user.name,
      taskDueToday: tasksDueToday,
      upcomingDeadlines: upcomingDeadlineCount,
    };

    const formattedActivities = recentActivities.map((a) => ({
      id: a.id,
      userName: a.user?.name || "Unknown",
      userImage: a.user?.avatar || null,
      action: a.action,
      time: getRelativeTime(a.createdAt),
    }));

    const formattedDeadlines = upcomingDeadlines.map((t) => {
      const d = new Date(t.dueDate);
      return {
        id: t.id,
        day: String(d.getDate()).padStart(2, "0"),
        month: d.toLocaleString("en", { month: "short" }),
        title: t.title,
        project: t.project?.name || "",
        priority: t.priority,
      };
    });

    const formattedActions = actionRequired.map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      dueDate: new Date(t.dueDate).toLocaleDateString("en", {
        day: "numeric", month: "short", year: "numeric",
      }),
    }));

    res.json({
      welcome, stats,
      recentActivities: formattedActivities,
      deadlines: formattedDeadlines,
      actions: formattedActions,
      projectProgress,
    });
  } catch (error) {
    next(error);
  }
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 18) return "Good afternoon,";
  return "Good evening,";
}

function getRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
