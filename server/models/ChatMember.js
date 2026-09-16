import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ChatMember = sequelize.define(
  "ChatMember",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    channelId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    lastReadAt: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true }
);

export default ChatMember;
