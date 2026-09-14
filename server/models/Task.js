import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Task = sequelize.define("Task", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  projectId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, defaultValue: "" },
  type: { type: DataTypes.ENUM("task", "story", "bug", "epic"), defaultValue: "task" },
  status: { type: DataTypes.ENUM("todo", "in-progress", "review", "done"), defaultValue: "todo" },
  statusId: { type: DataTypes.UUID, defaultValue: null },
  priority: { type: DataTypes.ENUM("high", "medium", "low"), defaultValue: "medium" },
  dueDate: { type: DataTypes.DATE },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  parentId: { type: DataTypes.UUID, defaultValue: null },
  epicId: { type: DataTypes.UUID, defaultValue: null },
  sprintId: { type: DataTypes.UUID, defaultValue: null },
  releaseId: { type: DataTypes.UUID, defaultValue: null },
  storyPoints: { type: DataTypes.INTEGER, defaultValue: null },
  labels: { type: DataTypes.JSON, defaultValue: [] },
}, { timestamps: true });

export default Task;
