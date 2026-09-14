import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getSLAs, createSLA, deleteSLA, getAuditLogs } from "../controllers/sla.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/", getSLAs);
router.post("/", createSLA);
router.delete("/:slaId", deleteSLA);
router.get("/audit-logs", getAuditLogs);

export default router;
