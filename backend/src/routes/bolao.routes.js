import { Router } from "express";
import { BolaoController } from "../controllers/bolao.controller.js";
import { verificarJWT, verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// rotas publicas
// Retorna a configuração global (ex: qual é o idJogo ativo)
router.get("/config", BolaoController.obterConfiguracao);
// Carrega o painel com os 10 slots (cruza apostas + sorteio)
router.get("/painel/:idJogo", BolaoController.consultarPainel);
// Participante escolhe e grava um slot
router.post("/apostar", BolaoController.apostarSlot);

// rotas privadas - admin
// Atualiza a configuração global (ex: define idJogoAtivo)
router.put("/config", verificarJWT, verificarAdmin, BolaoController.salvarConfiguracao);
// Executa o sorteio pegando os dados do Cartola e salvando no banco (é pra ser executado assim que o jogo começar ou quando o bolão encher)
router.get("/sorteio/:idJogo", verificarJWT, verificarAdmin, BolaoController.realizarSorteio);
// Remove um participante
router.delete("/:idJogo/slot/:numeroSlot", verificarJWT, verificarAdmin, BolaoController.deletarAposta);
// Altera o número do slot de alguém
router.patch("/:idJogo/alterar-slot", verificarJWT, verificarAdmin, BolaoController.alterarSlot);
// Altera o nome de um apostador (ou adiciona manualmente)
router.patch("/:idJogo/slot/:numeroSlot/nome", verificarJWT, verificarAdmin, BolaoController.alterarNomeParticipante);
// Altera o status de pagamento de uma aposta
router.patch("/:idJogo/slot/:numeroSlot/pagamento", verificarJWT, verificarAdmin, BolaoController.alternarPagamento);
// Altera o status manual do bolão (INATIVO, ABERTO, FECHADO)
router.put("/:idJogo/status", verificarJWT, verificarAdmin, BolaoController.alterarStatus);
// Salva a lista de jogadores manualmente
router.put("/:idJogo/jogadores", verificarJWT, verificarAdmin, BolaoController.salvarJogadores);
// Limpa/Reseta as apostas e sorteio do jogo para economizar espaço no banco
router.delete("/reset/:idJogo", verificarJWT, verificarAdmin, BolaoController.limparJogo);

export default router;
