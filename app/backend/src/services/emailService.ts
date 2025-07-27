import type { Transporter } from "nodemailer";
const nodemailer = require("nodemailer");
import { config } from "../config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  public transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Configurações adicionais para maior compatibilidade
      tls: {
        rejectUnauthorized: false,
      },
    });

    if (config.server.nodeEnv === "development") {
      this.verifyConnection();
    }
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {}
  }

  async sendEmail(options: any) {
    try {
      await this.transporter.verify();
      await this.transporter.sendMail(options);
      return true;
    } catch (error) {
      console.error("[EmailService.sendEmail] erro:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    resetLink: string,
    username: string
  ): Promise<boolean> {
    const subject = "Recuperação de Senha - Reserva Fácil";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🍽️ Reserva Fácil</div>
            <h1 style="margin: 0; font-size: 28px;">Recuperação de Senha</h1>
          </div>
          
          <div class="content">
            <h2>Olá, ${username}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Reserva Fácil</strong>.</p>
            
            <p>Para criar uma nova senha, clique no botão abaixo:</p>
            
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Redefinir Minha Senha</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0;">
                <li>Este link é válido por apenas <strong>1 hora</strong></li>
                <li>Se você não solicitou esta recuperação, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 14px;">
              ${resetLink}
            </p>
            
            <p>Se você não solicitou esta recuperação de senha, pode ignorar este email com segurança.</p>
          </div>
          
          <div class="footer">
            <p><strong>Reserva Fácil</strong> - Sistema de Reservas de Restaurante</p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Recuperação de Senha - Reserva Fácil
      
      Olá, ${username}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta.
      
      Para criar uma nova senha, acesse o link abaixo:
      ${resetLink}
      
      IMPORTANTE:
      - Este link é válido por apenas 1 hora
      - Se você não solicitou esta recuperação, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Se você não solicitou esta recuperação de senha, pode ignorar este email com segurança.
      
      ---
      Reserva Fácil - Sistema de Reservas de Restaurante
    `;

    return this.sendEmail({ to, subject, html, text });
  }
}

export function createEmailService() {
  return new EmailService();
}
export const emailService = new EmailService();
