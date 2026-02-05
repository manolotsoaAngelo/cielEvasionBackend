import fs from "fs";
import path from "path";
import nodemailer from 'nodemailer';
import UsersService from "../services/users.js";
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
    constructor() {
    }

    async brevo() {
        return {
            host: process.env.BREVO_SMTP_HOST,
            port: process.env.BREVO_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASS
            },
            connectionTimeout: 30000,
            socketTimeout: 30000,
            greetingTimeout: 30000,
            tls: {
                rejectUnauthorized: false
            }
        }
    }

    async emailAdmin() {
        //return ['manolotsoa.randriambeloniaina@gmail.com', 'zelotobey@gmail.com', 'holiniainaprisca566@gmail.com']
        return ['manolotsoa.randriambeloniaina@gmail.com', 'contact@ciel-evasion.fr']
    }

    async init_data_html_template(path_template, emailData) {
        let htmlTemplate = fs.readFileSync(path_template, "utf8");
        for (const key in emailData) {
            if (emailData[key] && emailData[key] !== null && emailData[key] !== undefined && emailData[key] !== '') {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, emailData[key]);
            } else {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, '...');
            }
        }
        return htmlTemplate
    }

    async email_Tj8PgM(data) {
        let objet = "Confirmation de rendez vous"
        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_Tj8PgM.html"
        );
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, data.destinataire);
    }

    async email_Tiam3wq(data) {
        let objet = "Demande de rendez vous"
        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_Tiam3wq.html"
        );
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, data.destinataire);
    }

    async email_Tib2QVP(data) {
        let objet = "Demande de disponibilité Ciel-ÉVASION®"
        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_Tib2QVP.html"
        );
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, data.destinataire);
    }

    async send(htmlTemplate, objet, destinataire) {

        let all_destinataire = (await this.emailAdmin()).concat((await UsersService.getById(destinataire)).loginEmail)

        let expediteur = all_destinataire[0]
        const mailOptions = {
            from: '"dev-contact-Ciel-ÉVASION®" <' + [expediteur] + '>',
            to: all_destinataire,
            subject: objet,
            text: "Bonjour !",
            html: htmlTemplate
        };

        const transporter = nodemailer.createTransport(await this.brevo());
        const result = await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur d\'envoi d\'email:', error);
                    reject(error);
                } else {
                    console.log('Email envoyé avec succès. ID:', info.messageId);
                    console.log('Réponse du serveur:', info.response);
                    resolve(info);
                }
            });
        });

        return {
            success: true,
            message: 'Email envoyé avec succès',
            messageId: result.messageId,
            response: result.response
        };
    }
}

export default new EmailService();
