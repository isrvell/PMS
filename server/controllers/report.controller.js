import { Sprint, Task } from "../models/index.js";

export const getVelocityReport = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const where = { workspaceId: req.workspace.id };
    if (projectId) where.projectId = projectId;

    const sprints = await Sprint.findAll({
      where,
      include: [{ model: Task, as: "tasks" }],
      order: [["createdAt", "ASC"]],
    });

    const data = sprints.map((s) => {
      const totalTasks = s.tasks.length;
      const completedTasks = s.tasks.filter((t) => t.status === "done").length;
      const totalPoints = s.tasks.reduce((sum, t) => sum + (t.storyPoints || 1), 0);
      const completedPoints = s.tasks
        .filter((t) => t.status === "done")
        .reduce((sum, t) => sum + (t.storyPoints || 1), 0);

      return {
        sprintId: s.id,
        sprintName: s.name,
        totalTasks,
        completedTasks,
        totalPoints,
        completedPoints,
      };
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getCreatedVsResolvedReport = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { workspaceId: req.workspace.id },
      attributes: ["id", "status", "type", "createdAt", "updatedAt"],
    });

    const byType = {
      task: tasks.filter((t) => t.type === "task").length,
      story: tasks.filter((t) => t.type === "story").length,
      bug: tasks.filter((t) => t.type === "bug").length,
      epic: tasks.filter((t) => t.type === "epic").length,
    };

    const byStatus = {
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
    };

    res.json({
      total: tasks.length,
      resolved: byStatus.done,
      open: tasks.length - byStatus.done,
      byType,
      byStatus,
    });
  } catch (error) {
    next(error);
  }
};
