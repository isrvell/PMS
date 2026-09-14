import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import requireRole from "../middleware/roles.js";
import {
  createInvitation,
  getInvitations,
  revokeInvitation,
  resendInvitation,
} from "../controllers/invitation.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext, requireRole("admin"));

router.post(
  "/",
  [body("email").isEmail().withMessage("Valid email is required"), validate],
  createInvitation
);

router.get("/", getInvitations);
router.delete("/:invitationId", revokeInvitation);
router.post("/:invitationId/resend", resendInvitation);

export default router;
