import nodemailer from 'nodemailer'
import { envs } from '../../config/plugins/envs.plugin'


interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachements?: Attachement[];
}

interface Attachement {
    path: string;
    filename: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })

    constructor(
    ) {}

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const {to, subject, htmlBody, attachements = []} = options;
        try {
            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements
            });
            console.log(sentInformation);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
        
    }

    async sendEmailWithFileSystemLogs(to: string | string[], ) {
        const subject = "Logs del servidor";
        const htmlBody = `
        <h3> Logs del sistema </h3>
        <p>Lore iso</p> 
        <p>Ver logs adjuntos</p>
      `
      const attachments: Attachement[] = [
        {filename: 'logs-all.log', path:'./logs/logs-all.log'},
        {filename: 'logs-high.log', path:'./logs/logs-high.log'},
        {filename: 'logs-medium.log', path:'./logs/logs-medium.log'},
      ];
      return this.sendEmail({to, subject, htmlBody, attachements: attachments});
    }
}