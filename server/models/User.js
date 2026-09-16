import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, defaultValue: null },
  role: { type: DataTypes.ENUM("admin", "member"), defaultValue: "member" },
  jobTitle: { type: DataTypes.STRING, defaultValue: "Developer Frontend" },
  department: { type: DataTypes.STRING, defaultValue: "frontend" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed("password")) user.password = await bcrypt.hash(user.password, 12);
    },
  },
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
