import { Router } from "express";
import { login, logout, profile, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/profile", profile);

export default router;
