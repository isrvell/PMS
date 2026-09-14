import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: {
    type: DataTypes.ENUM("task_assigned", "comment_added", "task_updated", "mention", "deadline", "sprint", "invitation", "general"),
    defaultValue: "general",
  },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT },
  entityType: { type: DataTypes.STRING },
  entityId: { type: DataTypes.UUID },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

export default Notification;
