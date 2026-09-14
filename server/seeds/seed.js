import { connectDB } from "../config/db.js";
import {
  sequelize, User, Workspace, WorkspaceMember, TeamMember,
  WorkflowStatus,
} from "../models/index.js";
import env from "../config/env.js";

async function seed() {
  try {
    await connectDB();
    await sequelize.sync({ force: true });
    console.log("Database synced and reset.");

    // 1. Create Admin User
    const admin = await User.create({
      name: env.ADMIN_NAME || "Admin User",
      email: env.ADMIN_EMAIL || "admin@example.com",
      password: env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    // 2. Create Default Workspace
    const workspace = await Workspace.create({
      name: "Default Workspace",
      description: "Main project management workspace",
      ownerId: admin.id,
    });

    await WorkspaceMember.create({
      workspaceId: workspace.id,
      userId: admin.id,
      role: "admin",
    });

    await TeamMember.create({
      workspaceId: workspace.id,
      userId: admin.id,
      role: "Project Manager",
      department: "Engineering",
      availability: "available",
    });

    // 3. Create Member User
    const member = await User.create({
      name: "Sarah Martin",
      email: "sarah@pms.com",
      password: "member123",
      role: "member",
    });

    await WorkspaceMember.create({
      workspaceId: workspace.id,
      userId: member.id,
      role: "member",
    });

    await TeamMember.create({
      workspaceId: workspace.id,
      userId: member.id,
      role: "Frontend Developer",
      department: "Frontend",
      availability: "available",
    });

    // 4. Create Default Workflow Statuses
    await WorkflowStatus.bulkCreate([
      { workspaceId: workspace.id, name: "To Do", category: "todo", color: "#64748b", order: 0, isSystem: true },
      { workspaceId: workspace.id, name: "In Progress", category: "in_progress", color: "#3b82f6", order: 1, isSystem: true },
      { workspaceId: workspace.id, name: "Code Review", category: "in_progress", color: "#eab308", order: 2, isSystem: false },
      { workspaceId: workspace.id, name: "Done", category: "done", color: "#22c55e", order: 3, isSystem: true },
    ]);

    console.log("\n=============================================");
    console.log("  Database Seeded — Clean Start");
    console.log("=============================================");
    console.log(`  Admin:  ${admin.email} / ${env.ADMIN_PASSWORD || "admin123"}`);
    console.log(`  Member: ${member.email} / member123`);
    console.log("=============================================\n");

    await sequelize.close();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
