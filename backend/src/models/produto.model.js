import { z } from "zod";

export class Produto {
  constructor({ nome, preco, descricao = "", foto }) {
    this.nome = nome;
    this.preco = preco;
    this.descricao = descricao;
    this.foto = foto;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      nome: this.nome,
      preco: this.preco,
      descricao: this.descricao,
      foto: this.foto, 
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const ProdutoValidationSchema = z.object({
  nome: z.string().min(1, "Nome do produto é obrigatório"),
  preco: z.coerce
    .number()
    .positive("Insira um preço válido")
    .transform((value) => value.toString()),
  descricao: z.string().optional(),

  // string para Base64 vindo do front e transforma
  fotoBase64: z
    .string()
    .min(1, "A foto do produto é obrigatória")
    .transform((value, ctx) => {
      // Expressão regular para validar e destrinchar a estrutura do Data URL
      const matches = value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (!matches) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A foto deve ser enviada em formato Data URL Base64 válido.",
        });
        return z.NEVER;
      }

      return {
        contentType: matches[1], // image/png" ou "image/jpeg"
        data: Buffer.from(matches[2], "base64"), // converte os caracteres em binário
      };
    }),
});
