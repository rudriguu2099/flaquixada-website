import { Router } from "express";
import { BolaoController } from "../controllers/bolao.controller.js";

const router = Router();

router.get("/sorteio/:idJogo", BolaoController.realizarSorteio);

export default router;
