import { Router } from "express";
import { login, logout, profile, refresh, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/profile", profile);
router.post("/refresh", refresh);

export default router;
