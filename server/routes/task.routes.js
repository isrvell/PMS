import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import requireRole from "../middleware/roles.js";
import {
  getTasks,
  getProjectTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  deleteTask,
  createSubtask,
} from "../controllers/task.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/", getTasks);
router.patch(
  "/reorder",
  [body("tasks").isArray().withMessage("Tasks array is required"), validate],
  reorderTasks
);

router.get("/project/:projectId", getProjectTasks);
router.post(
  "/project/:projectId",
  [body("title").trim().notEmpty().withMessage("Task title is required"), validate],
  createTask
);

router.get("/:taskId", getTask);
router.put("/:taskId", updateTask);
router.patch(
  "/:taskId/status",
  [body("status").isIn(["todo", "in-progress", "review", "done"]).withMessage("Invalid status"), validate],
  updateTaskStatus
);
router.post(
  "/:taskId/subtasks",
  [body("title").trim().notEmpty().withMessage("Subtask title is required"), validate],
  createSubtask
);
router.delete("/:taskId", requireRole("admin"), deleteTask);

export default router;
