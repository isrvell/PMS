import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SavedFilter = sequelize.define("SavedFilter", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  query: { type: DataTypes.JSON, allowNull: false },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

export default SavedFilter;
