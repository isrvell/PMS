import { User, Invitation, Workspace, WorkspaceMember, TeamMember, Activity } from "../models/index.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { token, name, password } = req.body;

    const invitation = await Invitation.findOne({ where: { token, status: "pending" } });
    if (!invitation) {
      return res.status(400).json({ message: "Invalid or expired invitation" });
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ message: "Invitation has expired" });
    }

    let user = await User.findOne({ where: { email: invitation.email } });

    if (user) {
      // Existing user accepting invite to join workspace
      const isMember = await WorkspaceMember.findOne({
        where: { workspaceId: invitation.workspaceId, userId: user.id },
      });
      if (!isMember) {
        await WorkspaceMember.create({
          workspaceId: invitation.workspaceId,
          userId: user.id,
          role: invitation.role,
        });
      }

      const existingTeamMember = await TeamMember.findOne({
        where: { workspaceId: invitation.workspaceId, userId: user.id },
      });
      if (!existingTeamMember) {
        const workspace = await Workspace.findByPk(invitation.workspaceId);
        const departments = workspace?.departments || ["frontend"];
        await TeamMember.create({
          workspaceId: invitation.workspaceId,
          userId: user.id,
          role: "Team Member",
          department: departments[0],
          availability: "available",
        });
      }
    } else {
      // New user registration
      if (!name || !password || password.length < 6) {
        return res.status(400).json({ message: "Name and a password of at least 6 characters are required" });
      }

      user = await User.create({
        name,
        email: invitation.email,
        password,
        role: invitation.role,
      });

      await WorkspaceMember.create({
        workspaceId: invitation.workspaceId,
        userId: user.id,
        role: invitation.role,
      });

      const workspace = await Workspace.findByPk(invitation.workspaceId);
      const departments = workspace?.departments || ["frontend"];

      await TeamMember.create({
        workspaceId: invitation.workspaceId,
        userId: user.id,
        role: "Team Member",
        department: departments[0],
        availability: "available",
      });
    }

    invitation.status = "accepted";
    await invitation.save();

    await Activity.create({
      workspaceId: invitation.workspaceId,
      userId: user.id,
      action: "joined the workspace",
      entityType: "workspace",
      entityId: invitation.workspaceId,
    });

    const jwtToken = generateToken(user.id);
    res.status(201).json({ token: jwtToken, user });
  } catch (error) {
    next(error);
  }
};

export const validateInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const invitation = await Invitation.findOne({
      where: { token, status: "pending" },
      include: [{ model: Workspace, attributes: ["name"] }],
    });

    if (!invitation) {
      return res.status(400).json({ valid: false, message: "Invalid invitation" });
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ valid: false, message: "Invitation has expired" });
    }

    const existingUser = await User.findOne({ where: { email: invitation.email } });
    const workspaceName = invitation.Workspace?.name || invitation.workspace?.name || "Workspace";

    res.json({
      valid: true,
      email: invitation.email,
      workspaceName,
      isExistingUser: !!existingUser,
      existingName: existingUser?.name || "",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const memberships = await WorkspaceMember.findAll({
      where: { userId: req.user.id },
      include: [{ model: Workspace, attributes: ["id", "name", "description"] }],
    });

    const user = req.user.toJSON();
    user.workspaces = memberships.map((m) => m.Workspace);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    await User.update(updates, { where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.update({ avatar: avatarUrl }, { where: { id: req.user.id } });
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
