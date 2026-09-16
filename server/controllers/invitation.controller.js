import { Invitation, User, WorkspaceMember, Activity } from "../models/index.js";
import generateInviteCode from "../utils/generateInviteCode.js";
import sendEmail from "../utils/sendEmail.js";
import env from "../config/env.js";

export const createInvitation = async (req, res, next) => {
  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const isMember = await WorkspaceMember.findOne({
        where: { workspaceId: req.workspace.id, userId: existingUser.id },
      });
      if (isMember) {
        return res.status(409).json({ message: "User is already a workspace member" });
      }
    }

    const existingInvite = await Invitation.findOne({
      where: { email, workspaceId: req.workspace.id, status: "pending" },
    });
    if (existingInvite) {
      return res.status(409).json({ message: "Pending invitation already exists for this email" });
    }

    const token = generateInviteCode();
    const invitation = await Invitation.create({
      workspaceId: req.workspace.id,
      email,
      role: role || "member",
      invitedById: req.user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const inviteUrl = `${env.CLIENT_URL}/invite/${token}`;

    // Try to send email (non-blocking — invitation is created regardless)
    const emailResult = await sendEmail({
      to: email,
      subject: `You've been invited to ${req.workspace.name}`,
      html: `
        <h2>Workspace Invitation</h2>
        <p>${req.user.name} has invited you to join <strong>${req.workspace.name}</strong> as a <strong>${role || "member"}</strong>.</p>
        <p><a href="${inviteUrl}" style="background:#10276d;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Accept Invitation</a></p>
        <p>This invitation expires in 7 days.</p>
        <p><small>If the button doesn't work, copy this link: ${inviteUrl}</small></p>
      `,
    });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `invited ${email} to the workspace`,
      entityType: "invitation",
      entityId: invitation.id,
    });

    const response = invitation.toJSON();
    response.inviteUrl = inviteUrl;
    response.emailSent = emailResult.sent !== false;

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.findAll({
      where: { workspaceId: req.workspace.id },
      include: [{ model: User, as: "invitedBy", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    // Add invite URLs
    const result = invitations.map((inv) => {
      const data = inv.toJSON();
      data.inviteUrl = `${env.CLIENT_URL}/invite/${inv.token}`;
      return data;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const revokeInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findOne({
      where: { id: req.params.invitationId, workspaceId: req.workspace.id, status: "pending" },
    });
    if (!invitation) return res.status(404).json({ message: "Invitation not found or already processed" });

    invitation.status = "revoked";
    await invitation.save();
    res.json({ message: "Invitation revoked" });
  } catch (error) {
    next(error);
  }
};

export const resendInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findOne({
      where: { id: req.params.invitationId, workspaceId: req.workspace.id, status: "pending" },
    });
    if (!invitation) return res.status(404).json({ message: "Invitation not found or already processed" });

    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await invitation.save();

    const inviteUrl = `${env.CLIENT_URL}/invite/${invitation.token}`;
    const emailResult = await sendEmail({
      to: invitation.email,
      subject: `Reminder: You've been invited to ${req.workspace.name}`,
      html: `
        <h2>Workspace Invitation Reminder</h2>
        <p>You have a pending invitation to join <strong>${req.workspace.name}</strong>.</p>
        <p><a href="${inviteUrl}" style="background:#10276d;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Accept Invitation</a></p>
        <p>This invitation expires in 7 days.</p>
      `,
    });

    res.json({ message: "Invitation resent", inviteUrl, emailSent: emailResult.sent !== false });
  } catch (error) {
    next(error);
  }
};
