import { SavedFilter } from "../models/index.js";

export const getFilters = async (req, res, next) => {
  try {
    const filters = await SavedFilter.findAll({
      where: { workspaceId: req.workspace.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(filters);
  } catch (error) {
    next(error);
  }
};

export const createFilter = async (req, res, next) => {
  try {
    const { name, query, isPublic } = req.body;
    if (!name || !query) return res.status(400).json({ message: "Name and query are required" });

    const filter = await SavedFilter.create({
      workspaceId: req.workspace.id,
      userId: req.user.id,
      name,
      query,
      isPublic: isPublic || false,
    });

    res.status(201).json(filter);
  } catch (error) {
    next(error);
  }
};

export const deleteFilter = async (req, res, next) => {
  try {
    const { filterId } = req.params;
    const filter = await SavedFilter.findOne({ where: { id: filterId, workspaceId: req.workspace.id } });
    if (!filter) return res.status(404).json({ message: "Filter not found" });

    await filter.destroy();
    res.json({ message: "Filter deleted" });
  } catch (error) {
    next(error);
  }
};
