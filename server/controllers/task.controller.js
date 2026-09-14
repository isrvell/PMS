import { Task, TaskMember, TaskLink, User, Project, Activity, Comment } from "../models/index.js";
import { notifyMany } from "../utils/notifyHelper.js";

export const getTasks = async (req, res, next) => {
  try {
    const where = { workspaceId: req.workspace.id, parentId: null };
    if (req.query.project) where.projectId = req.query.project;
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;
    if (req.query.epic) where.epicId = req.query.epic;
    if (req.query.sprint) where.sprintId = req.query.sprint;
    if (req.query.backlog === "true") where.sprintId = null;
    if (req.query.release) where.releaseId = req.query.release;
    if (req.query.search) {
      const { Op } = await import("sequelize");
      const term = `%${req.query.search}%`;
      where[Op.or] = [{ title: { [Op.like]: term } }, { description: { [Op.like]: term } }];
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: TaskMember, as: "taskMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] },
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: Task, as: "epic", attributes: ["id", "title"] },
      ],
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    const result = tasks.map((t) => {
      const json = t.toJSON();
      json.members = json.taskMembers.map((tm) => tm.user);
      json._id = json.id;
      delete json.taskMembers;
      return json;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { workspaceId: req.workspace.id, projectId: req.params.projectId },
      include: [{ model: TaskMember, as: "taskMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] }],
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    const result = tasks.map((t) => {
      const json = t.toJSON();
      json.members = json.taskMembers.map((tm) => tm.user);
      json._id = json.id;
      delete json.taskMembers;
      return json;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, members, type, epicId, sprintId, releaseId, storyPoints } = req.body;
    const projectId = req.params.projectId || req.body.project;

    const lastTask = await Task.findOne({
      where: { workspaceId: req.workspace.id, status: status || "todo" },
      order: [["order", "DESC"]],
    });

    const task = await Task.create({
      workspaceId: req.workspace.id,
      projectId,
      title, description, status, priority, dueDate,
      type: type || "task",
      epicId: epicId || null,
      sprintId: sprintId || null,
      releaseId: releaseId || null,
      storyPoints: storyPoints || null,
      order: lastTask ? lastTask.order + 1 : 0,
    });

    if (members?.length) {
      await TaskMember.bulkCreate(members.map((userId) => ({ taskId: task.id, userId })));
      // Notify assigned members
      await notifyMany({
        workspaceId: req.workspace.id,
        userIds: members.filter((uid) => uid !== req.user.id),
        type: "task_assigned",
        title: `You were assigned to "${title}"`,
        message: `${req.user.name} assigned you to a new ${type || "task"}`,
        entityType: "task",
        entityId: task.id,
      });
    }

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `created ${type || "task"} "${title}"`,
      entityType: "task",
      entityId: task.id,
    });

    const populated = await Task.findByPk(task.id, {
      include: [{ model: TaskMember, as: "taskMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] }],
    });
    const json = populated.toJSON();
    json.members = json.taskMembers.map((tm) => tm.user);
    json._id = json.id;
    delete json.taskMembers;

    res.status(201).json(json);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.taskId, workspaceId: req.workspace.id },
      include: [
        { model: TaskMember, as: "taskMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] },
        { model: Project, as: "project", attributes: ["id", "name"] },
        { model: Task, as: "epic", attributes: ["id", "title"] },
        { model: Task, as: "subtasks", include: [{ model: TaskMember, as: "taskMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }] }] },
        { model: Comment, as: "comments", include: [{ model: User, as: "author", attributes: ["id", "name", "email", "avatar"] }], order: [["createdAt", "ASC"]] },
        { model: TaskLink, as: "outgoingLinks", include: [{ model: Task, as: "targetTask", attributes: ["id", "title", "status", "type", "priority"] }] },
        { model: TaskLink, as: "incomingLinks", include: [{ model: Task, as: "sourceTask", attributes: ["id", "title", "status", "type", "priority"] }] },
      ],
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    const json = task.toJSON();
    json._id = json.id;
    json.members = (json.taskMembers || []).map((tm) => tm.user);
    delete json.taskMembers;
    if (json.subtasks) {
      json.subtasks = json.subtasks.map((s) => {
        s._id = s.id;
        s.members = (s.taskMembers || []).map((tm) => tm.user);
        delete s.taskMembers;
        return s;
      });
    }
    // Flatten links into a single array
    json.links = [
      ...(json.outgoingLinks || []).map((l) => ({ id: l.id, linkType: l.linkType, direction: "outgoing", task: l.targetTask })),
      ...(json.incomingLinks || []).map((l) => ({ id: l.id, linkType: l.linkType, direction: "incoming", task: l.sourceTask })),
    ];
    delete json.outgoingLinks;
    delete json.incomingLinks;
    res.json(json);
  } catch (error) {
    next(error);
  }
};

export const createSubtask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const parent = await Task.findOne({ where: { id: req.params.taskId, workspaceId: req.workspace.id } });
    if (!parent) return res.status(404).json({ message: "Parent task not found" });

    const subtask = await Task.create({
      workspaceId: req.workspace.id,
      projectId: parent.projectId,
      parentId: parent.id,
      title,
      description,
      priority: priority || "medium",
      status: "todo",
      dueDate,
      order: 0,
    });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `added subtask "${title}" to "${parent.title}"`,
      entityType: "task",
      entityId: subtask.id,
    });

    res.status(201).json({ ...subtask.toJSON(), _id: subtask.id });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.taskId, workspaceId: req.workspace.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.update(req.body);

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `updated task "${task.title}"`,
      entityType: "task",
      entityId: task.id,
    });

    // Notify task members about the update
    const taskMembers = await TaskMember.findAll({ where: { taskId: task.id } });
    const recipientIds = taskMembers
      .map((tm) => tm.userId)
      .filter((uid) => uid !== req.user.id);
    if (recipientIds.length > 0) {
      await notifyMany({
        workspaceId: req.workspace.id,
        userIds: recipientIds,
        type: "task_updated",
        title: `Task "${task.title}" updated`,
        message: `${req.user.name} updated the task`,
        entityType: "task",
        entityId: task.id,
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await Task.findOne({ where: { id: req.params.taskId, workspaceId: req.workspace.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.update({ status });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `moved task "${task.title}" to ${status}`,
      entityType: "task",
      entityId: task.id,
    });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body;
    for (const t of tasks) {
      await Task.update({ status: t.status, order: t.order }, { where: { id: t.id, workspaceId: req.workspace.id } });
    }
    res.json({ message: "Tasks reordered" });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.taskId, workspaceId: req.workspace.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `deleted task "${task.title}"`,
      entityType: "task",
      entityId: task.id,
    });

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
