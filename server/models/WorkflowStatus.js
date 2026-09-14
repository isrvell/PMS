import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WorkflowStatus = sequelize.define("WorkflowStatus", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: {
    type: DataTypes.ENUM("todo", "in_progress", "done"),
    defaultValue: "in_progress",
  },
  color: { type: DataTypes.STRING, defaultValue: "#3b82f6" },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  isSystem: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

export default WorkflowStatus;
