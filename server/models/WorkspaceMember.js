import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const WorkspaceMember = sequelize.define("WorkspaceMember", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
}, { timestamps: true });

export default WorkspaceMember;
