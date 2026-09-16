import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TeamMember = sequelize.define("TeamMember", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  availability: { type: DataTypes.ENUM("available", "remote", "on leave"), defaultValue: "available" },
}, { timestamps: true });

export default TeamMember;
