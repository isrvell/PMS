import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import { getFilters, createFilter, deleteFilter } from "../controllers/filter.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/", getFilters);
router.post("/", createFilter);
router.delete("/:filterId", deleteFilter);

export default router;
