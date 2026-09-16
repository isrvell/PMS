import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChatChannel = sequelize.define(
  "ChatChannel",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    workspaceId: { type: DataTypes.UUID, allowNull: false },
    projectId: { type: DataTypes.UUID, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM("general", "project", "direct"),
      defaultValue: "general",
    },
    description: { type: DataTypes.STRING, defaultValue: "" },
    createdById: { type: DataTypes.UUID, allowNull: true },
  },
  { timestamps: true }
);

export default ChatChannel;
