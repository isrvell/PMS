import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Activity = sequelize.define("Activity", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  entityType: { type: DataTypes.STRING },
  entityId: { type: DataTypes.UUID },
  details: { type: DataTypes.JSON, defaultValue: {} },
}, { timestamps: true });

export default Activity;
