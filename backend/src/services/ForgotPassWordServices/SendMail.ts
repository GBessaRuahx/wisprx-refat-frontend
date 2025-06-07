import nodemailer from "nodemailer";
import sequelize from "sequelize";
import database from "../../database";
import Setting from "../../models/Setting";
import { config } from "dotenv";
config();
interface UserData {
  companyId: number;
}
const SendMail = async (name: string, email: string, tokenSenha: string) => {
  const { hasResult, data } = await filterEmail(email);
  if (!hasResult) {
    return { status: 404, message: "Email não encontrado" };
  }
  const userData = data[0][0] as UserData;
  if (!userData || userData.companyId === undefined) {
    return { status: 404, message: "Dados do usuário não encontrados" };
  }
  const companyId = userData.companyId;
  const urlSmtp = process.env.MAIL_HOST;
  const userSmtp = process.env.MAIL_USER;
  const passwordSmpt = process.env.MAIL_PASS;
  const fromEmail = `"WisprX Suporte" <${process.env.MAIL_FROM}>`;
  const transporter = nodemailer.createTransport({
    host: urlSmtp,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: { 
      user: userSmtp, 
      pass: passwordSmpt 
    }
  });
  if (hasResult === true) {
    const { hasResults, datas } = await insertToken(email, tokenSenha);
    async function sendEmail() {
      try {
        console.log("Iniciando envio de email...");
        console.log("Configurações SMTP:", {
          host: urlSmtp,
          port: process.env.MAIL_PORT,
          secure: false,
          from: fromEmail,
          to: email
        });
        
        const mailOptions = {
          from: fromEmail,
          to: email,
          subject: "Redefinição de Senha - WisprX -",
          html: `<!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha - WisprX</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #F0F0F0; text-align: center; padding: 20px; margin: 0;">
            <table align="center" width="100%" style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); border-top: 5px solid #00A86B; margin: auto;">
                <tr>
                    <td align="center">
                        <img src="https://app.ruahx.online/logo_mail.png" alt="WisprX" style="width: 160px; margin-bottom: 20px;">
                        <h1 style="color: #333; font-size: 22px; margin-bottom: 15px;">Recuperação de Senha</h1>
                        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Olá, <strong>${name}</strong>!</p>
                        <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Recebemos uma solicitação para redefinir sua senha no WisprX.</p>
                        <p style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Código de Verificação:</p>
                        
                        <!-- Código de Verificação -->
                        <table align="center" style="background: #00A86B; color: #fff; font-size: 14px; font-weight: bold; padding: 10px; border-radius: 5px; text-align: center; width: 85%; max-width: 400px;">
                            <tr>
                                <td style="text-align: center; padding: 1px 0;">${tokenSenha}</td>
                            </tr>
                        </table>
                        
                        <p style="font-size: 12px; color: #666; margin-top: 10px;">🔔 O código expira em 30 minutos.</p>
                        <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Se você <strong>não solicitou</strong> essa redefinição, ignore este e-mail.</p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px auto; width: 80%;">

                        <!-- Suporte -->
                        <p style="font-size: 12px; color: #666;"> Está com alguma dúvida? Entre em contato com o suporte: <br>
                            <a href="mailto:suporte@wisprx.com" style="color: #00A86B; font-weight: bold; text-decoration: none;">suporte@wisprx.com</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`
        };
        
        console.log("Tentando enviar email para:", email);
        const info = await transporter.sendMail(mailOptions);
        
        if (info.messageId) {
          console.log("Email enviado com sucesso!");
          console.log("ID da mensagem:", info.messageId);
          console.log("Resposta do servidor:", info.response);
          return { status: 200, message: "Email enviado com sucesso" };
        } else {
          console.log("Email enviado, mas sem ID de mensagem");
          return { status: 200, message: "Email enviado" };
        }
      } catch (error) {
        console.error("Erro ao enviar email:", error);
        console.error("Stack trace:", error.stack);
        return { status: 500, message: "Erro ao enviar email", error: error.message };
      }
    }
    sendEmail();
  }
};
const filterEmail = async (email: string) => {
  const sql = `SELECT * FROM "Users"  WHERE email ='${email}'`;
  const result = await database.query(sql, {
    type: sequelize.QueryTypes.SELECT
  });
  return { hasResult: result.length > 0, data: [result] };
};
const insertToken = async (email: string, tokenSenha: string) => {
  const sqls = `UPDATE "Users" SET "resetPassword"= '${tokenSenha}' WHERE email ='${email}'`;
  const results = await database.query(sqls, {
    type: sequelize.QueryTypes.UPDATE
  });
  return { hasResults: results.length > 0, datas: results };
};
export default SendMail;
