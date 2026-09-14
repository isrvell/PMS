import { Op } from "sequelize";
import { Project, Task, TaskMember, User, TeamMember, ProjectMember } from "../models/index.js";

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ projects: [], tasks: [], members: [] });
    }

    const term = `%${q.trim()}%`;
    const workspaceId = req.workspace.id;

    const [projects, tasks, members] = await Promise.all([
      Project.findAll({
        where: {
          workspaceId,
          [Op.or]: [
            { name: { [Op.like]: term } },
            { description: { [Op.like]: term } },
          ],
        },
        limit: 5,
      }),
      Task.findAll({
        where: {
          workspaceId,
          parentId: null,
          [Op.or]: [
            { title: { [Op.like]: term } },
            { description: { [Op.like]: term } },
          ],
        },
        include: [{ model: Project, as: "project", attributes: ["id", "name"] }],
        limit: 10,
      }),
      TeamMember.findAll({
        where: { workspaceId },
        include: [{
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "avatar"],
          where: {
            [Op.or]: [
              { name: { [Op.like]: term } },
              { email: { [Op.like]: term } },
            ],
          },
        }],
        limit: 5,
      }),
    ]);

    res.json({
      projects: projects.map((p) => ({ id: p.id, name: p.name, description: p.description, status: p.status })),
      tasks: tasks.map((t) => ({
        id: t.id, _id: t.id, title: t.title, status: t.status, priority: t.priority,
        project: t.project ? { id: t.project.id, name: t.project.name } : null,
      })),
      members: members.map((m) => ({
        id: m.user.id, name: m.user.name, email: m.user.email, avatar: m.user.avatar,
        role: m.role, department: m.department,
      })),
    });
  } catch (error) {
    next(error);
  }
};
