import { WorkflowStatus, WorkflowTransition } from "../models/index.js";

const DEFAULT_STATUSES = [
  { name: "To Do", category: "todo", color: "#64748b", order: 0, isSystem: true },
  { name: "In Progress", category: "in_progress", color: "#3b82f6", order: 1, isSystem: true },
  { name: "Review", category: "in_progress", color: "#eab308", order: 2, isSystem: true },
  { name: "Done", category: "done", color: "#22c55e", order: 3, isSystem: true },
];

export const getStatuses = async (req, res, next) => {
  try {
    let statuses = await WorkflowStatus.findAll({
      where: { workspaceId: req.workspace.id },
      order: [["order", "ASC"]],
    });

    if (statuses.length === 0) {
      statuses = await WorkflowStatus.bulkCreate(
        DEFAULT_STATUSES.map((s) => ({ ...s, workspaceId: req.workspace.id }))
      );
    }

    res.json(statuses);
  } catch (error) {
    next(error);
  }
};

export const createStatus = async (req, res, next) => {
  try {
    const { name, category, color, order } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const status = await WorkflowStatus.create({
      workspaceId: req.workspace.id,
      name,
      category: category || "in_progress",
      color: color || "#3b82f6",
      order: order || 0,
      isSystem: false,
    });

    res.status(201).json(status);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const status = await WorkflowStatus.findOne({ where: { id: statusId, workspaceId: req.workspace.id } });
    if (!status) return res.status(404).json({ message: "Status not found" });

    await status.update(req.body);
    res.json(status);
  } catch (error) {
    next(error);
  }
};

export const deleteStatus = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const status = await WorkflowStatus.findOne({ where: { id: statusId, workspaceId: req.workspace.id } });
    if (!status) return res.status(404).json({ message: "Status not found" });
    if (status.isSystem) return res.status(400).json({ message: "Cannot delete system default status" });

    await status.destroy();
    res.json({ message: "Status deleted" });
  } catch (error) {
    next(error);
  }
};
