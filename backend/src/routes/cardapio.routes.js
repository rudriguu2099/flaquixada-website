import { Router } from "express";
import { CardapioController } from "../controllers/cardapio.controller.js";
import { verificarJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Rotas públicas
router.get("/", CardapioController.listar);
router.get("/:id", CardapioController.buscarPorId);

// Rotas privadas
router.post("/", verificarJWT, CardapioController.criar);
router.put("/:id", verificarJWT, CardapioController.atualizar);
router.delete("/:id", verificarJWT, CardapioController.deletar);

export default router;
