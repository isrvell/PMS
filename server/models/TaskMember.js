import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TaskMember = sequelize.define("TaskMember", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  taskId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
}, { timestamps: true });

export default TaskMember;
