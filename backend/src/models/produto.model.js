import { z } from "zod";

export class Produto {
  constructor({ nome, preco, descricao = "" }) {
    this.nome = nome;
    this.preco = preco;
    this.descricao = descricao;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      nome: this.nome,
      preco: this.preco,
      descricao: this.descricao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProdutoValidationSchema = z.object({
  nome: z.string().nonempty("Nome do produto é obrigatório"),
  preco: z.coerce
    .number()
    .positive("Insira um preço válido")
    .transform((value) => value.toString()),
  descricao: z.string().optional(),
});
