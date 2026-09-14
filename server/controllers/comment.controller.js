import { Comment, User, Task, TaskMember, Activity } from "../models/index.js";
import { notifyMany } from "../utils/notifyHelper.js";

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: { taskId: req.params.taskId },
      include: [{ model: User, as: "author", attributes: ["id", "name", "email", "avatar"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const task = await Task.findOne({ where: { id: req.params.taskId, workspaceId: req.workspace.id } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = await Comment.create({
      taskId: req.params.taskId,
      userId: req.user.id,
      content,
    });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `commented on "${task.title}"`,
      entityType: "task",
      entityId: task.id,
    });

    // Notify all task members except the commenter
    const taskMembers = await TaskMember.findAll({ where: { taskId: task.id } });
    const recipientIds = taskMembers
      .map((tm) => tm.userId)
      .filter((uid) => uid !== req.user.id);

    if (recipientIds.length > 0) {
      await notifyMany({
        workspaceId: req.workspace.id,
        userIds: recipientIds,
        type: "comment_added",
        title: `New comment on "${task.title}"`,
        message: `${req.user.name} commented: ${content.slice(0, 100)}`,
        entityType: "task",
        entityId: task.id,
      });
    }

    const populated = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: "author", attributes: ["id", "name", "email", "avatar"] }],
    });
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId !== req.user.id && req.workspaceRole !== "admin") {
      return res.status(403).json({ message: "Cannot delete this comment" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
