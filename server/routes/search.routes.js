import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { search } from "../controllers/search.controller.js";

const router = Router({ mergeParams: true });

router.use(auth, workspaceContext);
router.get("/", search);

export default router;
