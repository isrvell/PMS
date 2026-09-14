import { Workspace, WorkspaceMember } from "../models/index.js";

const workspaceContext = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findByPk(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const membership = await WorkspaceMember.findOne({
      where: { workspaceId, userId: req.user.id },
    });

    if (!membership) {
      return res.status(403).json({ message: "Not a member of this workspace" });
    }

    req.workspace = workspace;
    req.workspaceRole = membership.role;
    next();
  } catch (error) {
    next(error);
  }
};

export default workspaceContext;
