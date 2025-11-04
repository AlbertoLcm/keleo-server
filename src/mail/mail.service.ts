import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: Number(this.configService.get('MAIL_PORT')),
      secure: this.configService.get('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
  }

  private async renderTemplate(templateName: string, variables: Record<string, string>) {
    const srcPath = join(__dirname, '..', 'mail', 'templates', `${templateName}.html`);
    const distPath = join(process.cwd(), 'src', 'mail', 'templates', `${templateName}.html`);
  
    const templatePath = existsSync(srcPath) ? srcPath : distPath;
    let html = await readFileSync(templatePath, 'utf-8');

    // Reemplazar variables tipo {{nombre}}
    for (const [key, value] of Object.entries(variables)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return html;
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const html = await this.renderTemplate('verification', {
      name,
      token,
      verifyLink: `https://keleo.app/verify?token=${token}`,
    });

    try {
      await this.transporter.sendMail({
        from: `"Keleo App" <${this.configService.get('MAIL_USER')}>`,
        to: email,
        subject: '¡Confirma tu cuenta para acceder a Keleo App!',
        html,
      });
    } catch (err) {
      this.logger.error(`Error al enviar correo a ${email}: ${err.message}`);
      throw err;
    }
  }
}
