import { Router } from "express";
import { NoticiaController } from "../controllers/noticia.controller.js";
import { verificarJWT, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rotas públicas
router.get("/", NoticiaController.listar);
router.get("/:id", NoticiaController.buscarPorId);

// Rotas privadas - requerem admin
router.post("/", verificarJWT, verificarAdmin, NoticiaController.criar);
router.put("/:id", verificarJWT, verificarAdmin, NoticiaController.atualizar);
router.delete("/:id", verificarJWT, verificarAdmin, NoticiaController.deletar);

export default router;
