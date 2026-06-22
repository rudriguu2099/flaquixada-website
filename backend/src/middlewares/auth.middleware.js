import jwt from "jsonwebtoken";

export function verificarAutenticacao(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = payload;
    req.usuarioLogado = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Acesso negado. Token inválido ou expirado.",
    });
  }
}

export function permitirApenasSuperAdmin(req, res, next) {
  if (!req.usuarioLogado || req.usuarioLogado.role !== "super-admin") {
    return res.status(403).json({
      success: false,
      error:
        "Acesso proibido. Seu nível de acesso não possui permissão para esta ação.",
    });
  }

  return next();
}

export function permitirApenasAdmin(req, res, next) {
  if (
    !req.usuarioLogado ||
    !["admin", "super-admin"].includes(req.usuarioLogado.role)
  ) {
    return res.status(403).json({
      success: false,
      error:
        "Acesso proibido. Seu nível de acesso não possui permissão para esta ação.",
    });
  }

  return next();
}

export const verificarJWT = verificarAutenticacao;
export const verificarSuperAdmin = permitirApenasSuperAdmin;
export const verificarAdmin = permitirApenasAdmin;
