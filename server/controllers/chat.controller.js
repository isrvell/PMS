import { ChatChannel, ChatMessage, ChatMember, User, Project, WorkspaceMember } from "../models/index.js";
import { Op } from "sequelize";

const USER_ATTRS = ["id", "name", "email", "avatar", "role", "jobTitle", "department"];

export async function getChannels(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    // 1. Ensure default General channel exists for this workspace
    let generalChannel = await ChatChannel.findOne({
      where: { workspaceId, type: "general" },
    });
    if (!generalChannel) {
      generalChannel = await ChatChannel.create({
        workspaceId,
        name: "general",
        type: "general",
        description: "General workspace discussion",
        createdById: userId,
      });
    }

    // 2. Ensure channels exist for all projects in this workspace
    const projects = await Project.findAll({ where: { workspaceId } });
    for (const proj of projects) {
      const existingProjChannel = await ChatChannel.findOne({
        where: { workspaceId, projectId: proj.id, type: "project" },
      });
      if (!existingProjChannel) {
        await ChatChannel.create({
          workspaceId,
          projectId: proj.id,
          name: proj.name.toLowerCase().replace(/\s+/g, "-"),
          type: "project",
          description: `Channel for project ${proj.name}`,
          createdById: userId,
        });
      }
    }

    // 3. Fetch all public/project channels for workspace
    const publicChannels = await ChatChannel.findAll({
      where: {
        workspaceId,
        type: { [Op.in]: ["general", "project"] },
      },
      order: [["createdAt", "ASC"]],
    });

    // 4. Fetch Direct Message channels where req.user is a member
    const userMemberships = await ChatMember.findAll({
      where: { userId },
      attributes: ["channelId"],
    });
    const userChannelIds = userMemberships.map((m) => m.channelId);

    const directChannels = await ChatChannel.findAll({
      where: {
        workspaceId,
        type: "direct",
        id: { [Op.in]: userChannelIds },
      },
      include: [
        {
          model: ChatMember,
          as: "members",
          include: [{ model: User, as: "user", attributes: USER_ATTRS }],
        },
      ],
    });

    // 5. Fetch workspace team members to allow starting new DMs
    const workspaceMembers = await WorkspaceMember.findAll({
      where: { workspaceId },
      include: [{ model: User, as: "user", attributes: USER_ATTRS }],
    });

    res.json({
      channels: publicChannels,
      directChannels,
      workspaceMembers: workspaceMembers.map((m) => m.user).filter((u) => u && u.id !== userId),
    });
  } catch (err) {
    next(err);
  }
}

export async function createChannel(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const { name, description, projectId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const channelName = name.toLowerCase().trim().replace(/\s+/g, "-");
    const newChannel = await ChatChannel.create({
      workspaceId,
      projectId: projectId || null,
      name: channelName,
      type: projectId ? "project" : "general",
      description: description || "",
      createdById: req.user.id,
    });

    res.status(201).json(newChannel);
  } catch (err) {
    next(err);
  }
}

export async function getOrCreateDirectChannel(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    // Find direct channel shared by both userId and targetUserId
    const user1Memberships = await ChatMember.findAll({ where: { userId }, attributes: ["channelId"] });
    const user1ChannelIds = user1Memberships.map((m) => m.channelId);

    const sharedMemberships = await ChatMember.findAll({
      where: {
        userId: targetUserId,
        channelId: { [Op.in]: user1ChannelIds },
      },
      attributes: ["channelId"],
    });

    let channel = null;
    if (sharedMemberships.length > 0) {
      const directChannel = await ChatChannel.findOne({
        where: {
          id: { [Op.in]: sharedMemberships.map((m) => m.channelId) },
          workspaceId,
          type: "direct",
        },
        include: [
          {
            model: ChatMember,
            as: "members",
            include: [{ model: User, as: "user", attributes: USER_ATTRS }],
          },
        ],
      });
      if (directChannel) channel = directChannel;
    }

    if (!channel) {
      // Create new DM channel
      channel = await ChatChannel.create({
        workspaceId,
        name: `DM-${userId.slice(0, 4)}-${targetUserId.slice(0, 4)}`,
        type: "direct",
        createdById: userId,
      });

      await ChatMember.bulkCreate([
        { channelId: channel.id, userId },
        { channelId: channel.id, userId: targetUserId },
      ]);

      channel = await ChatChannel.findByPk(channel.id, {
        include: [
          {
            model: ChatMember,
            as: "members",
            include: [{ model: User, as: "user", attributes: USER_ATTRS }],
          },
        ],
      });
    }

    res.json(channel);
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { channelId } = req.params;

    const messages = await ChatMessage.findAll({
      where: { channelId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: USER_ATTRS,
        },
      ],
      order: [["createdAt", "ASC"]],
      limit: 100,
    });

    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { channelId } = req.params;
    const { content, attachments } = req.body;
    const senderId = req.user.id;

    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const channel = await ChatChannel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const message = await ChatMessage.create({
      channelId,
      senderId,
      content: content || "",
      attachments: attachments || [],
    });

    const fullMessage = await ChatMessage.findByPk(message.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: USER_ATTRS,
        },
      ],
    });

    // Notify room and individual user rooms for instant delivery
    const io = req.app.get("io");
    if (io) {
      io.to(`channel:${channelId}`).emit("new_message", fullMessage);

      // If DM channel, notify target members' personal user rooms as well
      const members = await ChatMember.findAll({ where: { channelId } });
      for (const m of members) {
        io.to(`user:${m.userId}`).emit("new_message", fullMessage);
      }
    }

    res.status(201).json(fullMessage);
  } catch (err) {
    next(err);
  }
}
