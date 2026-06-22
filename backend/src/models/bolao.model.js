import { z } from "zod";

export const ApostaBolaoValidationSchema = z.object({
  idJogo: z.string().min(1, "O ID do jogo é obrigatório"),
  numeroSlot: z.number().int().min(1).max(10, "O número do slot deve ser de 1 a 10"),
  participanteNome: z.string().min(3, "Digite o nome completo do participante")
});

export const ConfigBolaoValidationSchema = z.object({
  idJogoAtivo: z.string().nullable().optional()
});

export const StatusBolaoValidationSchema = z.object({
  status: z.enum(["INATIVO", "ABERTO", "FECHADO"], { required_error: "Status inválido" })
});

export const JogadoresBolaoValidationSchema = z.object({
  jogadores: z.array(z.object({
    id: z.number().int(),
    nomeJogador: z.string()
  })).length(10, "A lista deve conter exatamente 10 jogadores")
});