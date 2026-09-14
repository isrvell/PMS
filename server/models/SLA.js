import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SLA = sequelize.define("SLA", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.ENUM("high", "medium", "low"), defaultValue: "high" },
  targetHours: { type: DataTypes.INTEGER, defaultValue: 24 },
}, { timestamps: true });

export default SLA;
