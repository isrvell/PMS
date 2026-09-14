import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);

router.get("/", getDashboard);

export default router;
