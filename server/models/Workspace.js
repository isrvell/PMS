import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Workspace = sequelize.define("Workspace", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, defaultValue: "" },
  ownerId: { type: DataTypes.UUID, allowNull: false },
  departments: { type: DataTypes.JSON, defaultValue: ["frontend", "backend", "design"] },
}, { timestamps: true });

export default Workspace;
