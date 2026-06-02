import { Router } from "express";
import { login, logout, profile, refresh, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { registerSchema } from "../validations/auth.validation";
import { authorize } from "../middleware/role.middleware";
import { protect } from "../middleware/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/profile", protect, authorize(Role.ADMIN, Role.USER), profile);
router.post("/refresh", refresh);

export default router;
