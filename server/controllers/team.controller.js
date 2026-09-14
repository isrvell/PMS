import { TeamMember, User } from "../models/index.js";

export const getTeamMembers = async (req, res, next) => {
  try {
    const where = { workspaceId: req.workspace.id };
    if (req.query.department) where.department = req.query.department;

    const members = await TeamMember.findAll({
      where,
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const { user, role, department, availability } = req.body;
    const member = await TeamMember.create({
      workspaceId: req.workspace.id,
      userId: user,
      role, department, availability,
    });
    const populated = await TeamMember.findByPk(member.id, {
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
    });
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOne({
      where: { id: req.params.teamMemberId, workspaceId: req.workspace.id },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
    });
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOne({ where: { id: req.params.teamMemberId, workspaceId: req.workspace.id } });
    if (!member) return res.status(404).json({ message: "Team member not found" });

    await member.update(req.body);
    const populated = await TeamMember.findByPk(member.id, {
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }],
    });
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findOne({ where: { id: req.params.teamMemberId, workspaceId: req.workspace.id } });
    if (!member) return res.status(404).json({ message: "Team member not found" });
    await member.destroy();
    res.json({ message: "Team member removed" });
  } catch (error) {
    next(error);
  }
};
