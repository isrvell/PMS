import { Workspace, WorkspaceMember, User, Activity } from "../models/index.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const workspace = await Workspace.create({ name, description, ownerId: req.user.id });
    await WorkspaceMember.create({ workspaceId: workspace.id, userId: req.user.id, role: "admin" });
    res.status(201).json(workspace);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (req, res, next) => {
  try {
    const memberships = await WorkspaceMember.findAll({ where: { userId: req.user.id } });
    const workspaceIds = memberships.map((m) => m.workspaceId);
    const workspaces = await Workspace.findAll({
      where: { id: workspaceIds },
      include: [{ model: User, as: "owner", attributes: ["id", "name", "email", "avatar"] }],
    });
    res.json(workspaces);
  } catch (error) {
    next(error);
  }
};

export const getWorkspace = async (req, res) => {
  const workspace = await Workspace.findByPk(req.workspace.id, {
    include: [{ model: WorkspaceMember, as: "members", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] }],
  });
  res.json(workspace);
};

export const updateWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (name) req.workspace.name = name;
    if (description !== undefined) req.workspace.description = description;
    await req.workspace.save();
    res.json(req.workspace);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (req, res, next) => {
  try {
    if (req.workspace.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Only the workspace owner can delete it" });
    }
    await req.workspace.destroy();
    res.json({ message: "Workspace deleted" });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const members = await WorkspaceMember.findAll({
      where: { workspaceId: req.workspace.id },
      include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar", "role", "isActive"] }],
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (req.workspace.ownerId === userId) {
      return res.status(400).json({ message: "Cannot remove the workspace owner" });
    }
    await WorkspaceMember.destroy({ where: { workspaceId: req.workspace.id, userId } });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: "removed a member from the workspace",
      entityType: "workspace",
      entityId: req.workspace.id,
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const member = await WorkspaceMember.findOne({ where: { workspaceId: req.workspace.id, userId } });
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.role = role;
    await member.save();
    res.json({ message: "Role updated" });
  } catch (error) {
    next(error);
  }
};
