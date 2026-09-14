import { Router } from "express";
import multer from "multer";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { getResources, uploadResource, deleteResource } from "../controllers/resource.controller.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: join(__dirname, "../uploads"),
  filename: (_req, file, cb) => {
    cb(null, crypto.randomUUID() + extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const router = Router({ mergeParams: true });

router.get("/projects/:projectId/resources", getResources);
router.post("/projects/:projectId/resources", upload.single("file"), uploadResource);
router.delete("/resources/:resourceId", deleteResource);

export default router;
