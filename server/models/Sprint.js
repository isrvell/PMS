import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Sprint = sequelize.define("Sprint", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  projectId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  goal: { type: DataTypes.STRING, defaultValue: "" },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM("future", "active", "closed"),
    defaultValue: "future",
  },
}, { timestamps: true });

export default Sprint;
