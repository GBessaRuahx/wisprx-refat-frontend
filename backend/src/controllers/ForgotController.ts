import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import SendMail from "../services/ForgotPassWordServices/SendMail";
import ResetPassword from "../services/ResetPasswordService/ResetPassword";
import User from "../models/User"; // Certifique-se de que o modelo está correto

type IndexQuery = { email?: string; token?: string; password?: string };

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.params as IndexQuery;

  // Buscar o usuário no banco de dados
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const name = user.name; // Certifique-se de que 'name' é o nome correto da coluna
  const TokenSenha = uuid();
  const forgotPassword = await SendMail(name, email, TokenSenha);
  if (!forgotPassword) {
     return res.status(200).json({ message: "E-mail enviado com sucesso" });
  }
  return res.status(404).json({ error: "E-mail enviado com sucesso" });
};

export const resetPasswords = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, token, password } = req.params as IndexQuery;
  const resetPassword = await ResetPassword(email, token, password);
  if (!resetPassword) {
    return res.status(200).json({ message: "Senha redefinida com sucesso" });
  }
  return res.status(404).json({ error: "Verifique o Token informado" });
};
