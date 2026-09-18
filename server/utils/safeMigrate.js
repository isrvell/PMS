import { DataTypes } from "sequelize";

/**
 * Safely add missing columns to PostgreSQL tables before sync().
 * Avoids Sequelize's broken ALTER TABLE ... REFERENCES syntax.
 */
export async function safeMigratePostgres(sequelize) {
  const qi = sequelize.getQueryInterface();

  // Define missing columns per table: [table, column, definition]
  const migrations = [
    ["Users", "jobTitle", { type: DataTypes.STRING, defaultValue: "Developer Frontend" }],
    ["Users", "department", { type: DataTypes.STRING, defaultValue: "frontend" }],
  ];

  for (const [table, column, definition] of migrations) {
    try {
      const columns = await qi.describeTable(table);
      if (!columns[column]) {
        await qi.addColumn(table, column, definition);
        console.log(`  ↳ Added column ${table}.${column}`);
      }
    } catch {
      // Table doesn't exist yet — sync() will create it
    }
  }
}
