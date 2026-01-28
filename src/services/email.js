//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/users.js";
import { init_cachedData_users, refreshData } from "../utils/fullData/users.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone";
let wixData_url_get_FullData =
    "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

import fs from "fs";
import nodemailer from 'nodemailer';
import UsersService from "../services/users.js";

class EmailService {
    constructor() {
    }

    async brevo() {
        return {
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: "a0e9f1001@smtp-brevo.com",
                pass: "xsmtpsib-fe2dbc63ea37ccc47537b9481043fc4e3e9e8ec41a1d9587a8f38702fa040d1c-Y6FaYx3kId7r3XKV"
            }
        }
    }

    async emailAdmin() {
        return ['manolotsoa.randriambeloniaina@gmail.com', 'zelotobey@gmail.com','holiniainaprisca566@gmail.com']
    }

    async init_data_html_template(path_template, emailData) {
        let htmlTemplate = fs.readFileSync(path_template, "utf8");
        for (const key in emailData) {
            if (emailData[key] !== null && emailData[key] !== undefined) {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, emailData[key]);
            } else {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, '...');
            }
        }
        return htmlTemplate
    }

    async send(htmlTemplate, objet, all_destinataire) {
        
        const transporter = nodemailer.createTransport(await this.brevo());
        const mailOptions = {
            from: '"dev-contact-Ciel-ÉVASION®" <' + [all_destinataire[0]] + '>',
            to: all_destinataire,
            subject: objet,
            text: "Bonjour !",
            html: htmlTemplate
        };
        transporter.sendMail(mailOptions, (error, info) => {
           if (error) {
               console.log(error);
           } else {
               console.log('Email envoyé: ' + info.response);
           }
       })
       return mailOptions
    }

    async email_Tib2QVP(data) {
        let objet = "Demande de disponibilité Ciel-ÉVASION®"
        let all_destinataire = (await this.emailAdmin()).concat((await UsersService.getById(data.destinataire)).loginEmail)
        
        let path_template = "src/utils/templateEmail/dispoEmail.html"
        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, all_destinataire);
    }

    
}

export default new EmailService();
