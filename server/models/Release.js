import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Release = sequelize.define("Release", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  projectId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, defaultValue: "" },
  startDate: { type: DataTypes.DATE },
  releaseDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM("unreleased", "released", "archived"),
    defaultValue: "unreleased",
  },
}, { timestamps: true });

export default Release;
