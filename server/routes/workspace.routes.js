import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import requireRole from "../middleware/roles.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  removeMember,
  updateMemberRole,
} from "../controllers/workspace.controller.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  [body("name").trim().notEmpty().withMessage("Workspace name is required"), validate],
  createWorkspace
);

router.get("/", getWorkspaces);

router.get("/:workspaceId", workspaceContext, getWorkspace);
router.put("/:workspaceId", workspaceContext, requireRole("admin"), updateWorkspace);
router.delete("/:workspaceId", workspaceContext, requireRole("admin"), deleteWorkspace);

router.get("/:workspaceId/members", workspaceContext, getMembers);
router.delete("/:workspaceId/members/:userId", workspaceContext, requireRole("admin"), removeMember);
router.put("/:workspaceId/members/:userId/role", workspaceContext, requireRole("admin"),
  [body("role").isIn(["admin", "member"]).withMessage("Role must be admin or member"), validate],
  updateMemberRole
);

export default router;
