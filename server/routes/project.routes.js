import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import requireRole from "../middleware/roles.js";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/project.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/", getProjects);
router.post(
  "/",
  requireRole("admin"),
  [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("date").notEmpty().isISO8601().withMessage("Valid date is required"),
    validate,
  ],
  createProject
);

router.get("/:projectId", getProject);
router.put("/:projectId", requireRole("admin"), updateProject);
router.delete("/:projectId", requireRole("admin"), deleteProject);

router.post("/:projectId/members", requireRole("admin"),
  [body("userId").notEmpty().withMessage("User ID is required"), validate],
  addMember
);
router.delete("/:projectId/members/:userId", requireRole("admin"), removeMember);

export default router;
