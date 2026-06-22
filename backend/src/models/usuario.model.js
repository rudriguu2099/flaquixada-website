import { z } from "zod";

export const UsuarioValidationSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  nome: z.string().min(5, "Nome deve ter mínimo 5 caracteres"),
  password: z.string().min(8, "Senha deve ter mínimo 8 caracteres"),
  role: z.enum(["admin", "super-admin"]).default("admin"),
});

export class Usuario {
  constructor({ email, nome, password, role = "admin" }) {
    this.email = email;
    this.nome = nome;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      email: this.email,
      nome: this.nome,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const LoginValidationSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});
