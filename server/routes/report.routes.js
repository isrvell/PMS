import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getVelocityReport, getCreatedVsResolvedReport } from "../controllers/report.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/velocity", getVelocityReport);
router.get("/created-vs-resolved", getCreatedVsResolvedReport);

export default router;
