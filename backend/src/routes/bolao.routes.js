import { Router } from "express";
import { BolaoController } from "../controllers/bolao.controller.js";
import { verificarJWT, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//rotas publicas
// Carrega o painel com os 10 slots (cruza apostas + sorteio)
router.get("/painel/:idJogo", BolaoController.consultarPainel);
// Participante escolhe e grava um slot
router.post("/apostar", BolaoController.apostarSlot);

// rotas privadas - admin
// Executa o sorteio pegando os dados do Cartola e salvando no banco (é pra ser executado assim que o jogo começar ou quando o bolão encher)
router.get("/sorteio/:idJogo", verificarJWT, verificarAdmin , BolaoController.realizarSorteio);
// Remove um participante
router.delete("/:idJogo/slot/:numeroSlot", verificarJWT, verificarAdmin, BolaoController.deletarAposta);
// Altera o número do slot de alguém
router.patch("/:idJogo/alterar-slot", verificarJWT, verificarAdmin, BolaoController.alterarSlot);
// Limpa/Reseta as apostas e sorteio do jogo para economizar espaço no banco
router.delete("/reset/:idJogo", verificarJWT, verificarAdmin, BolaoController.limparJogo);

export default router;
