import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { User } from "../models/user.model.js";

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
        email: user.email,
        role: user.role,
      },
    };
  }

  // ? role setada manualmente, funcao so de super-admin pra criar outros admin, outra role fica redundante
  static async registrar(email, password, role = "admin") {
    const usuarioExistente = await db.collection("users").findOne({ email });
    if (usuarioExistente) {
      throw new Error("Este e-mail já está cadastrado no sistema.");
    }

    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(password, saltRounds);

    const novoUsuario = new User({
      email,
      password: senhaCriptografada,
      role,
    });

    const resultado = await db
      .collection("users")
      .insertOne(novoUsuario.toDocument());

    return {
      id: resultado.insertedId,
      email: novoUsuario.email,
      role: novoUsuario.role,
    };
  }
}
