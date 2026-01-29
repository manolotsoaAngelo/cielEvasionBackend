//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/users.js";
import { init_cachedData_users, refreshData } from "../utils/fullData/users.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone";
let wixData_url_get_FullData =
    "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

import fs from "fs";
import path from "path";
import nodemailer from 'nodemailer';
import UsersService from "../services/users.js";
import Brevo from "@getbrevo/brevo";
import axios from "axios";
class EmailService {
    constructor() {
    }

    async brevo() {
        return {
            host: "smtp-relay.brevo.com",
            port: 2525, /// 587  # ou 465, 2525, 25
            secure: false,
            auth: {
                user: "a0e9f1001@smtp-brevo.com",
                pass: "xsmtpsib-fe2dbc63ea37ccc47537b9481043fc4e3e9e8ec41a1d9587a8f38702fa040d1c-Y6FaYx3kId7r3XKV"
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
        return ['manolotsoa.randriambeloniaina@gmail.com']
    }

    async init_data_html_template(path_template, emailData) {
        let htmlTemplate = fs.readFileSync(path_template, "utf8");
        for (const key in emailData) {
            if (emailData[key] !== null && emailData[key] !== undefined && emailData[key] !== '') {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, emailData[key]);
            } else {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, '...');
            }
        }
        return htmlTemplate
    }

    async email_Tiam3wq(data) {
        let objet = "Demande de rendez vous"
        let all_destinataire = (await this.emailAdmin()).concat((await UsersService.getById(data.destinataire)).loginEmail)

        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_Tiam3wq.html"
        );
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, all_destinataire);
    }

    async email_Tib2QVP(data) {
        let objet = "Demande de disponibilité Ciel-ÉVASION®"
        let all_destinataire = (await this.emailAdmin()).concat((await UsersService.getById(data.destinataire)).loginEmail)

        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_Tib2QVP.html"
        );
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, all_destinataire);
    }

    async send(htmlTemplate, objet, all_destinataire) {

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
