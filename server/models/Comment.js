import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  taskId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

export default Comment;
