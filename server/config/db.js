import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

let sequelize;

if (process.env.DATABASE_URL) {
  // PostgreSQL (production — Render, Railway, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === "false" ? false : {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // SQLite (local development)
  const dbPath = join(__dirname, "../database.sqlite");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
  });
}

const connectDB = async () => {
  await sequelize.authenticate();
  const dialect = sequelize.getDialect();
  console.log(`✅ Database connected (${dialect})`);
};

export { sequelize, connectDB };
export default sequelize;
