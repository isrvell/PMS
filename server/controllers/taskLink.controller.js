import { Task, TaskLink, Activity } from "../models/index.js";

export const getTaskLinks = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ where: { id: taskId, workspaceId: req.workspace.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const [outgoing, incoming] = await Promise.all([
      TaskLink.findAll({
        where: { sourceTaskId: taskId },
        include: [{ model: Task, as: "targetTask", attributes: ["id", "title", "status", "type", "priority"] }],
      }),
      TaskLink.findAll({
        where: { targetTaskId: taskId },
        include: [{ model: Task, as: "sourceTask", attributes: ["id", "title", "status", "type", "priority"] }],
      }),
    ]);

    const links = [
      ...outgoing.map((l) => ({
        id: l.id,
        linkType: l.linkType,
        direction: "outgoing",
        task: l.targetTask,
      })),
      ...incoming.map((l) => ({
        id: l.id,
        linkType: l.linkType,
        direction: "incoming",
        task: l.sourceTask,
      })),
    ];

    res.json(links);
  } catch (error) {
    next(error);
  }
};

export const createTaskLink = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { targetTaskId, linkType } = req.body;

    if (taskId === targetTaskId) {
      return res.status(400).json({ message: "Cannot link a task to itself" });
    }

    const [source, target] = await Promise.all([
      Task.findOne({ where: { id: taskId, workspaceId: req.workspace.id } }),
      Task.findOne({ where: { id: targetTaskId, workspaceId: req.workspace.id } }),
    ]);

    if (!source) return res.status(404).json({ message: "Source task not found" });
    if (!target) return res.status(404).json({ message: "Target task not found" });

    const existing = await TaskLink.findOne({
      where: { sourceTaskId: taskId, targetTaskId, linkType },
    });
    if (existing) return res.status(409).json({ message: "Link already exists" });

    const link = await TaskLink.create({ sourceTaskId: taskId, targetTaskId, linkType });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `linked "${source.title}" ${linkType} "${target.title}"`,
      entityType: "task",
      entityId: taskId,
    });

    const populated = await TaskLink.findByPk(link.id, {
      include: [{ model: Task, as: "targetTask", attributes: ["id", "title", "status", "type", "priority"] }],
    });

    res.status(201).json({
      id: populated.id,
      linkType: populated.linkType,
      direction: "outgoing",
      task: populated.targetTask,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskLink = async (req, res, next) => {
  try {
    const { linkId } = req.params;

    const link = await TaskLink.findByPk(linkId, {
      include: [
        { model: Task, as: "sourceTask", attributes: ["id", "title", "workspaceId"] },
        { model: Task, as: "targetTask", attributes: ["id", "title"] },
      ],
    });

    if (!link) return res.status(404).json({ message: "Link not found" });
    if (link.sourceTask.workspaceId !== req.workspace.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `removed link "${link.sourceTask.title}" ${link.linkType} "${link.targetTask.title}"`,
      entityType: "task",
      entityId: link.sourceTaskId,
    });

    await link.destroy();
    res.json({ message: "Link deleted" });
  } catch (error) {
    next(error);
  }
};
