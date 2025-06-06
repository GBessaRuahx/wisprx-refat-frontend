import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: 'gabrielbessa@gmail.com',
      subject: 'Teste de Email - SendGrid',
      text: 'Este é um teste de envio de email usando SendGrid',
      html: '<h1>Teste de Email</h1><p>Este é um teste de envio de email usando SendGrid</p>'
    });

    console.log('Email enviado com sucesso!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

testEmail(); 