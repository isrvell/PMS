import { Release, Task, Activity } from "../models/index.js";

export const getReleases = async (req, res, next) => {
  try {
    const where = { workspaceId: req.workspace.id };
    if (req.query.project) where.projectId = req.query.project;
    if (req.query.status) where.status = req.query.status;

    const releases = await Release.findAll({
      where,
      include: [{ model: Task, as: "tasks" }],
      order: [["createdAt", "DESC"]],
    });

    res.json(releases);
  } catch (error) {
    next(error);
  }
};

export const createRelease = async (req, res, next) => {
  try {
    const { projectId, name, description, startDate, releaseDate } = req.body;
    if (!projectId || !name) {
      return res.status(400).json({ message: "projectId and name are required" });
    }

    const release = await Release.create({
      workspaceId: req.workspace.id,
      projectId,
      name,
      description: description || "",
      startDate: startDate || null,
      releaseDate: releaseDate || null,
    });

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `created release "${name}"`,
      entityType: "release",
      entityId: release.id,
    });

    res.status(201).json(release);
  } catch (error) {
    next(error);
  }
};

export const updateRelease = async (req, res, next) => {
  try {
    const { releaseId } = req.params;
    const release = await Release.findOne({ where: { id: releaseId, workspaceId: req.workspace.id } });
    if (!release) return res.status(404).json({ message: "Release not found" });

    await release.update(req.body);

    await Activity.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      action: `updated release "${release.name}"`,
      entityType: "release",
      entityId: release.id,
    });

    res.json(release);
  } catch (error) {
    next(error);
  }
};

export const deleteRelease = async (req, res, next) => {
  try {
    const { releaseId } = req.params;
    const release = await Release.findOne({ where: { id: releaseId, workspaceId: req.workspace.id } });
    if (!release) return res.status(404).json({ message: "Release not found" });

    await Task.update({ releaseId: null }, { where: { releaseId: release.id } });
    await release.destroy();

    res.json({ message: "Release deleted" });
  } catch (error) {
    next(error);
  }
};
