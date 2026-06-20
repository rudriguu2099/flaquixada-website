import { z } from "zod";

export class User {
  constructor({ email, password, role }) {
    this.email = email;
    this.password = password; // senha já deve vir criptografada para o construtor
    this.role = role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      email: this.email,
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

export const RegistroValidationSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});
