import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define("Project", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, defaultValue: "" },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM("completed", "active", "in-hold"), defaultValue: "active" },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

export default Project;
