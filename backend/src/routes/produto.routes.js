import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller.js";
import {
  permitirApenasAdmin,
  verificarAutenticacao,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ProdutoController.listarTodos);

router.post(
  "/",
  verificarAutenticacao,
  permitirApenasAdmin,
  ProdutoController.criarProduto,
);
router.put(
  "/:id",
  verificarAutenticacao,
  permitirApenasAdmin,
  ProdutoController.editarProduto,
);
router.delete(
  "/:id",
  verificarAutenticacao,
  permitirApenasAdmin,
  ProdutoController.deletarProduto,
);

export default router;
