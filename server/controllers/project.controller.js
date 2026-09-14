import { Project, ProjectMember, Task, User, Activity } from "../models/index.js";

export const getProjects = async (req, res, next) => {
  try {
    const where = { workspaceId: req.workspace.id };
    if (req.query.status) where.status = req.query.status;

    const projects = await Project.findAll({
      where,
      include: [{ model: ProjectMember, as: "projectMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] }],
      order: [["createdAt", "DESC"]],
    });

    const result = await Promise.all(projects.map(async (p) => {
      const json = p.toJSON();
      json.members = json.projectMembers.map((pm) => pm.user);
      delete json.projectMembers;

      // Compute real-time progress from tasks
      const totalTasks = await Task.count({ where: { projectId: p.id } });
      const doneTasks = await Task.count({ where: { projectId: p.id, status: "done" } });
      json.progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      return json;
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, date, status, progress, members } = req.body;
    const project = await Project.create({
      workspaceId: req.workspace.id,
      name, description, date, status, progress,
    });

    if (members?.length) {
      await ProjectMember.bulkCreate(members.map((userId) => ({ projectId: project.id, userId })));
    }

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `created project "${name}"`,
      entityType: "project",
      entityId: project.id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, workspaceId: req.workspace.id },
      include: [{ model: ProjectMember, as: "projectMembers", include: [{ model: User, as: "user", attributes: ["id", "name", "email", "avatar"] }] }],
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const json = project.toJSON();
    const totalTasks = await Task.count({ where: { projectId: project.id } });
    const doneTasks = await Task.count({ where: { projectId: project.id, status: "done" } });
    json.progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    res.json(json);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.projectId, workspaceId: req.workspace.id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.update(req.body);

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `updated project "${project.name}"`,
      entityType: "project",
      entityId: project.id,
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ where: { id: req.params.projectId, workspaceId: req.workspace.id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `deleted project "${project.name}"`,
      entityType: "project",
      entityId: project.id,
    });

    await project.destroy();
    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findOne({ where: { id: req.params.projectId, workspaceId: req.workspace.id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const exists = await ProjectMember.findOne({ where: { projectId: project.id, userId } });
    if (!exists) {
      await ProjectMember.create({ projectId: project.id, userId });
    }

    res.json({ message: "Member added" });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    await ProjectMember.destroy({
      where: { projectId: req.params.projectId, userId: req.params.userId },
    });
    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};
