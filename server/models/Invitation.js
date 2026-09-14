import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Invitation = sequelize.define("Invitation", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  workspaceId: { type: DataTypes.UUID, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
  invitedById: { type: DataTypes.UUID, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.ENUM("pending", "accepted", "expired", "revoked"), defaultValue: "pending" },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: true });

export default Invitation;
