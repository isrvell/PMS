import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Resource = sequelize.define("Resource", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  projectId: { type: DataTypes.UUID, allowNull: false },
  uploadedBy: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  originalName: { type: DataTypes.STRING, allowNull: false },
  mimeType: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

export default Resource;
