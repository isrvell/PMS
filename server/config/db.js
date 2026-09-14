import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "../database.sqlite");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

const connectDB = async () => {
  await sequelize.authenticate();
  console.log(`SQLite connected: ${dbPath}`);
};

export { sequelize, connectDB };
export default sequelize;
