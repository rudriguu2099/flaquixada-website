import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import {
  permitirApenasSuperAdmin,
  verificarAutenticacao,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", AuthController.login);
router.post(
  "/register",
  verificarAutenticacao,
  permitirApenasSuperAdmin,
  AuthController.registrar,
);

export default router;
