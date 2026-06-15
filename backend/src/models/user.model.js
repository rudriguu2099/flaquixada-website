import { z } from "zod";

export const LoginValidationSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});

export class User {
  constructor({ email, password, roles = ["admin"] }) {
    this.email = email;
    this.password = password; // senha já deve vir criptografada para o construtor
    this.roles = roles;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toDocument() {
    return {
      email: this.email,
      password: this.password,
      roles: this.roles,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
