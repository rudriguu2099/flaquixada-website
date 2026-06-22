import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";
import {
  verificarJWT,
  verificarAdmin,
  verificarSuperAdmin,
} from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/", verificarJWT, verificarAdmin, UsuarioController.listar);
router.get("/:id", verificarJWT, verificarAdmin, UsuarioController.buscarPorId);
router.post("/", verificarJWT, verificarSuperAdmin, UsuarioController.criar);
router.put("/:id", verificarJWT, verificarAdmin, UsuarioController.atualizar);
router.delete("/:id", verificarJWT, verificarSuperAdmin, UsuarioController.deletar);

export default router;
