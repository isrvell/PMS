import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TaskLink = sequelize.define("TaskLink", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  sourceTaskId: { type: DataTypes.UUID, allowNull: false },
  targetTaskId: { type: DataTypes.UUID, allowNull: false },
  linkType: {
    type: DataTypes.ENUM("blocks", "is-blocked-by", "duplicate", "related"),
    allowNull: false,
  },
}, { timestamps: true });

export default TaskLink;
