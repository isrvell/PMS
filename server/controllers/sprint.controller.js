import { Sprint, Task, Activity } from "../models/index.js";

export const getSprints = async (req, res, next) => {
  try {
    const where = { workspaceId: req.workspace.id };
    if (req.query.project) where.projectId = req.query.project;
    if (req.query.status) where.status = req.query.status;

    const sprints = await Sprint.findAll({
      where,
      include: [{ model: Task, as: "tasks" }],
      order: [["createdAt", "DESC"]],
    });

    res.json(sprints);
  } catch (error) {
    next(error);
  }
};

export const createSprint = async (req, res, next) => {
  try {
    const { projectId, name, goal, startDate, endDate } = req.body;
    if (!projectId || !name) {
      return res.status(400).json({ message: "projectId and name are required" });
    }

    const sprint = await Sprint.create({
      workspaceId: req.workspace.id,
      projectId,
      name,
      goal: goal || "",
      startDate: startDate || null,
      endDate: endDate || null,
    });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `created sprint "${name}"`,
      entityType: "sprint",
      entityId: sprint.id,
    });

    res.status(201).json(sprint);
  } catch (error) {
    next(error);
  }
};

export const updateSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findOne({ where: { id: sprintId, workspaceId: req.workspace.id } });
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });

    await sprint.update(req.body);

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `updated sprint "${sprint.name}"`,
      entityType: "sprint",
      entityId: sprint.id,
    });

    res.json(sprint);
  } catch (error) {
    next(error);
  }
};

export const startSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findOne({ where: { id: sprintId, workspaceId: req.workspace.id } });
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });

    await sprint.update({ status: "active", startDate: req.body.startDate || new Date() });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `started sprint "${sprint.name}"`,
      entityType: "sprint",
      entityId: sprint.id,
    });

    res.json(sprint);
  } catch (error) {
    next(error);
  }
};

export const completeSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findOne({ where: { id: sprintId, workspaceId: req.workspace.id } });
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });

    await sprint.update({ status: "closed" });

    // Move unfinished tasks back to backlog if requested
    if (req.body.moveUnfinishedToBacklog) {
      await Task.update(
        { sprintId: null },
        { where: { sprintId: sprint.id, workspaceId: req.workspace.id, status: ["todo", "in-progress", "review"] } }
      );
    }

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `completed sprint "${sprint.name}"`,
      entityType: "sprint",
      entityId: sprint.id,
    });

    res.json(sprint);
  } catch (error) {
    next(error);
  }
};

export const deleteSprint = async (req, res, next) => {
  try {
    const { sprintId } = req.params;
    const sprint = await Sprint.findOne({ where: { id: sprintId, workspaceId: req.workspace.id } });
    if (!sprint) return res.status(404).json({ message: "Sprint not found" });

    await Task.update({ sprintId: null }, { where: { sprintId: sprint.id } });
    await sprint.destroy();

    res.json({ message: "Sprint deleted" });
  } catch (error) {
    next(error);
  }
};
