import { Resource, User } from "../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getResources = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const resources = await Resource.findAll({
      where: { projectId, workspaceId: req.params.workspaceId },
      include: [{ model: User, as: "uploader", attributes: ["id", "name", "avatar"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const uploadResource = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { projectId } = req.params;
    const resource = await Resource.create({
      workspaceId: req.params.workspaceId,
      projectId,
      uploadedBy: req.user.id,
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });

    const full = await Resource.findByPk(resource.id, {
      include: [{ model: User, as: "uploader", attributes: ["id", "name", "avatar"] }],
    });

    res.status(201).json(full);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findOne({
      where: { id: req.params.resourceId, workspaceId: req.params.workspaceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, "..", resource.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resource.destroy();
    res.json({ message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
};
