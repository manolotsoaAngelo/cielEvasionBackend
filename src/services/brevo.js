import nodemailer from 'nodemailer';
//import dotenv from 'dotenv';
//dotenv.config();

class BrevoService {
    constructor() {
        this.transporter = nodemailer.createTransport(this.config());
    }
    async Usage_limit() {
        return ((await this.BrevoAccount()).plan[0]).credits
    }
    async BrevoAccount() {
        const res = await fetch("https://api.brevo.com/v3/account", {
            method: "GET",
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json"
            }
        });

        return await res.json();
    }

    config() {
        return {
            host: process.env.BREVO_SMTP_HOST,
            port: Number(process.env.BREVO_SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASS
            },
            connectionTimeout: 30000,
            socketTimeout: 30000,
            greetingTimeout: 30000
        };
    }

    async send(htmlTemplate, objet, expediteur, destinataire) {
        try {
            const mailOptions = {
                from: `"Contact-Ciel-ÉVASION®" <${expediteur}>`,
                to: destinataire,
                subject: objet,
                html: htmlTemplate
            };

            const info = await this.transporter.sendMail(mailOptions);

            let msg = 'Envoi email à : ' + destinataire + ' avec messageId : ' + info.messageId
            console.log(msg);
            return {
                success: true,
                messageId: msg,
                response: info.response
            };

        } catch (error) {
            console.error('Erreur envoi email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new BrevoService();
