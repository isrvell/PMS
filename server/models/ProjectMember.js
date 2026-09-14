import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProjectMember = sequelize.define("ProjectMember", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  projectId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
}, { timestamps: true });

export default ProjectMember;
