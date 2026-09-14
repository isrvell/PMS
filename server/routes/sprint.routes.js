import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import {
  getSprints, createSprint, updateSprint, startSprint, completeSprint, deleteSprint,
} from "../controllers/sprint.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/", getSprints);
router.post("/", createSprint);
router.put("/:sprintId", updateSprint);
router.post("/:sprintId/start", startSprint);
router.post("/:sprintId/complete", completeSprint);
router.delete("/:sprintId", deleteSprint);

export default router;
