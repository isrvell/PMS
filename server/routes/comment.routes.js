import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getComments, createComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/:taskId/comments", getComments);
router.post(
  "/:taskId/comments",
  [body("content").trim().notEmpty().withMessage("Comment content is required"), validate],
  createComment
);
router.delete("/:taskId/comments/:commentId", deleteComment);

export default router;
