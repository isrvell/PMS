import { SLA, Activity, User } from "../models/index.js";

export const getSLAs = async (req, res, next) => {
  try {
    const slas = await SLA.findAll({
      where: { workspaceId: req.workspace.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(slas);
  } catch (error) {
    next(error);
  }
};

export const createSLA = async (req, res, next) => {
  try {
    const { name, priority, targetHours } = req.body;
    if (!name) return res.status(400).json({ message: "SLA name is required" });

    const sla = await SLA.create({
      workspaceId: req.workspace.id,
      name,
      priority: priority || "high",
      targetHours: targetHours || 24,
    });

    res.status(201).json(sla);
  } catch (error) {
    next(error);
  }
};

export const deleteSLA = async (req, res, next) => {
  try {
    const { slaId } = req.params;
    const sla = await SLA.findOne({ where: { id: slaId, workspaceId: req.workspace.id } });
    if (!sla) return res.status(404).json({ message: "SLA not found" });

    await sla.destroy();
    res.json({ message: "SLA deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await Activity.findAll({
      where: { workspaceId: req.workspace.id },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
      order: [["createdAt", "DESC"]],
      limit: 100,
    });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
