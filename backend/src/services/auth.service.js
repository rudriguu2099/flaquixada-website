import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      { id: user._id, email: user.email, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expira em 1 dia
    );

    return {
      token,
      user: {
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
