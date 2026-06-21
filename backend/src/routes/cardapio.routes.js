import { Router } from "express";
import { CardapioController } from "../controllers/cardapio.controller.js";
import { verificarJWT, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rotas públicas
router.get("/", CardapioController.listar);
router.get("/:id", CardapioController.buscarPorId);

// Rotas privadas - requerem admin
router.post("/", verificarJWT, verificarAdmin, CardapioController.criar);
router.put("/:id", verificarJWT, verificarAdmin, CardapioController.atualizar);
router.delete("/:id", verificarJWT, verificarAdmin, CardapioController.deletar);

export default router;
