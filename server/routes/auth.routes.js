import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import { login, register, validateInvite, getMe, updateMe, uploadAvatar } from "../controllers/auth.controller.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    if (allowed.includes(extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  login
);

router.post(
  "/register",
  [
    body("token").notEmpty().withMessage("Invitation token is required"),
    validate,
  ],
  register
);

router.post("/validate-invite/:token", validateInvite);

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.post("/me/avatar", auth, upload.single("avatar"), uploadAvatar);

export default router;
