import { Router } from "express";
import auth from "../middleware/auth.js";
import workspaceContext from "../middleware/workspaceContext.js";
import {
  getReleases, createRelease, updateRelease, deleteRelease,
} from "../controllers/release.controller.js";

const router = Router({ mergeParams: true });
router.use(auth, workspaceContext);

router.get("/", getReleases);
router.post("/", createRelease);
router.put("/:releaseId", updateRelease);
router.delete("/:releaseId", deleteRelease);

export default router;
