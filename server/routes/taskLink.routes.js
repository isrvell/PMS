import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getTaskLinks, createTaskLink, deleteTaskLink } from "../controllers/taskLink.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/:taskId/links", getTaskLinks);

router.post(
  "/:taskId/links",
  [
    body("targetTaskId").isUUID().withMessage("Target task ID is required"),
    body("linkType").isIn(["blocks", "is-blocked-by", "duplicate", "related"]).withMessage("Invalid link type"),
    validate,
  ],
  createTaskLink
);

router.delete("/:taskId/links/:linkId", deleteTaskLink);

export default router;
