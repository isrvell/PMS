import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import {
  getStatuses, createStatus, updateStatus, deleteStatus,
} from "../controllers/workflow.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/statuses", getStatuses);
router.post("/statuses", createStatus);
router.put("/statuses/:statusId", updateStatus);
router.delete("/statuses/:statusId", deleteStatus);

export default router;
