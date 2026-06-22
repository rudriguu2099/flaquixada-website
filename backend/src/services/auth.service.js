import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";


export class AuthService {
  static async login(email, password) {
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      throw new Error("Credenciais inválidas.");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expira em 1 dia
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }


}
