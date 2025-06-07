import * as Yup from "yup";
import nodemailer from "nodemailer";
import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import User from "../../models/User";
import Plan from "../../models/Plan";
import Company from "../../models/Company";
import { config } from "dotenv";
config();

interface Request {
  email: string;
  password: string;
  name: string;
  queueIds?: number[];
  companyId?: number;
  profile?: string;
  whatsappId?: number;
  allTicket?:string;
  super?: boolean;
  owner?: boolean;
}

interface Response {
  email: string;
  name: string;
  id: number;
  profile: string;
}

const CreateUserService = async ({
  email,
  password,
  name,
  queueIds = [],
  companyId,
  profile = "admin",
  whatsappId,
  allTicket,
  super: isSuper = false,
  owner = false
}: Request): Promise<Response> => {
  if (companyId !== undefined) {
    const company = await Company.findOne({
      where: {
        id: companyId
      },
      include: [{ model: Plan, as: "plan" }]
    });

    if (company !== null) {
      const usersCount = await User.count({
        where: {
          companyId
        }
      });

      if (usersCount >= company.plan.users) {
        throw new AppError(
          `Número máximo de usuários já alcançado: ${usersCount}`
        );
      }
    }
  }

  const schema = Yup.object().shape({
    name: Yup.string().required().min(2),
    email: Yup.string()
      .email()
      .required()
      .test(
        "Check-email",
        "An user with this email already exists.",
        async value => {
          if (!value) return false;
          const emailExists = await User.findOne({
            where: { email: value }
          });
          return !emailExists;
        }
      ),
    password: Yup.string().required().min(5)
  });

  try {
    await schema.validate({ email, password, name });
  } catch (err) {
    throw new AppError(err.message);
  }

  if (owner) {
    const previousOwner = await User.findOne({ where: { owner: true, companyId } });
    if (previousOwner) {
      await previousOwner.update({ owner: false });
    }
  }

  const user = await User.create(
    {
      email,
      password,
      name,
      companyId,
      profile,
      whatsappId: whatsappId || null,
      allTicket,
      super: owner ? true : isSuper,
      owner
    },
    { include: ["queues", "company"] }
  );

  await user.$set("queues", queueIds);

  await user.reload();

  // Enviando email de boas-vindas
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Bem-vindo ao S-WhiteLabel",
    html: `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao WisprX</title>
    <style>
        body {
            font-family: 'SF Pro Display', 'Inter', Arial, sans-serif;
            background-color: #F0F0F0;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-top: 5px solid #3fd358;
            margin: auto;
        }
        img {
            width: 140px;
            margin-bottom: 15px;
        }
        h1 {
            color: #333;
            font-size: 22px;
            margin-bottom: 15px;
        }
        p {
            color: #333;
            font-size: 16px;
            margin-bottom: 10px;
        }
        .info-box {
            background: #F3F3F3;
            padding: 5px 15px;
            border-radius: 6px;
            text-align: left;
            margin: 15px 0;
            font-size: 12px;
            line-height: 2.5;
        }
        .info-box strong {
            color: #333;
        }
        .button {
            display: inline-block;
            background: #3fd358;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            padding: 12px 20px;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 10px;
            margin-bottom: 10px;
            transition: background 0.3s;
        }
        .button:hover {
            background: #2db147;
        }
        .support {
            margin-top: 15px;
            font-size: 12px;
        }
        .support a {
            color: #3fd358;
            font-weight: bold;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="URL_DA_SUA_LOGO" alt="WisprX">
        <h1>Bem-vindo ao WisprX!</h1>
        <p>Olá, ${name}!</p>
        <p>Seu acesso foi criado com sucesso!<p>
        <p>Aqui estão suas credenciais:</p>
        
        <div class="info-box">
            <strong>Email:</strong> ${email}<br>
            <strong>Senha:</strong> ${password}
        </div>

        <p>Para acessar o sistema, clique no botão abaixo:</p>
        <a href="URL_DO_SISTEMA" class="button">Acessar Sistema</a>

        <hr>
        <p class="support">❓ Tem alguma dúvida? Entre em contato com o suporte: <br>
            <a href="mailto:suporte@wisprx.com">suporte@wisprx.com</a>
        </p>
    </div>
</body>
</html>
`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de boas-vindas enviado para:", email);
  } catch (error) {
    console.error("Erro ao enviar email de boas-vindas:", error);
  }

  const serializedUser = SerializeUser(user);

  return serializedUser;
};

export default CreateUserService;
