import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import requireRole from "../middleware/roles.js";
import {
  getTeamMembers,
  createTeamMember,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/", getTeamMembers);
router.post(
  "/",
  requireRole("admin"),
  [
    body("user").notEmpty().withMessage("User ID is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
    body("department").isIn(["frontend", "backend", "design"]).withMessage("Invalid department"),
    validate,
  ],
  createTeamMember
);

router.get("/:teamMemberId", getTeamMember);
router.put("/:teamMemberId", requireRole("admin"), updateTeamMember);
router.delete("/:teamMemberId", requireRole("admin"), deleteTeamMember);

export default router;
