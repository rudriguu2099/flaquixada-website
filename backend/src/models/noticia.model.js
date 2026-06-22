import { z } from "zod";

export const NoticiaValidationSchema = z.object({
  titulo: z.string().min(5, "Título deve ter mínimo 5 caracteres"),
  resumo: z.string().min(10, "Resumo deve ter mínimo 10 caracteres"),
  categoria: z.string().min(3, "Categoria deve ter mínimo 3 caracteres"),
  data: z.string().datetime().optional(),
});

export class Noticia {
  constructor({ titulo, resumo, categoria, data }) {
    this.titulo = titulo;
    this.resumo = resumo;
    this.categoria = categoria;
    this.data = data || new Date().toISOString();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      titulo: this.titulo,
      resumo: this.resumo,
      categoria: this.categoria,
      data: this.data,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
