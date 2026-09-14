import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WorkflowTransition = sequelize.define("WorkflowTransition", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  fromStatusId: { type: DataTypes.UUID, defaultValue: null },
  toStatusId: { type: DataTypes.UUID, allowNull: false },
}, { timestamps: true });

export default WorkflowTransition;
