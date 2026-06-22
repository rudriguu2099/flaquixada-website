import { z } from "zod";

export const CardapioValidationSchema = z.object({
  nome: z.string().min(3, "Nome deve ter mínimo 3 caracteres"),
  descricao: z.string().min(3, "Descrição deve ter mínimo 3 caracteres"),
  preco_normal: z.number().positive("Preço normal deve ser positivo"),
  preco_socio: z.number().positive("Preço sócio deve ser positivo"),
  categoria: z.enum(["bebidas", "petiscos", "pratos"], {
    errorMap: () => ({ message: "Categoria deve ser: bebidas, petiscos ou pratos" }),
  }),
});

export class Cardapio {
  constructor({
    nome,
    descricao,
    preco_normal,
    preco_socio,
    categoria,
  }) {
    this.nome = nome;
    this.descricao = descricao;
    this.preco_normal = preco_normal;
    this.preco_socio = preco_socio;
    this.categoria = categoria;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      nome: this.nome,
      descricao: this.descricao,
      preco_normal: this.preco_normal,
      preco_socio: this.preco_socio,
      categoria: this.categoria,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
