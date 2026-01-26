//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/users.js";
import { init_cachedData_users, refreshData } from "../utils/fullData/users.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone";
let wixData_url_get_FullData =
    "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";


import fs from "fs";
import { Resend } from 'resend';

class EmailService {
    constructor() {
    }

    async ResendApiKey() {
        return 're_GVETd2gP_CNJVruMGjsJT3LCi9bNUVaWw'
    }

    async ResendDomain() {
        return 'dev.contact@ciel-evasion.fr <manolotsoa.randriambeloniaina@gmail.com>'
    }

    async sendEmailDispo(emailData) {
        let path_template = "src/utils/templateEmail/dispoEmail.html"
        let objet = "Demande de disponibilité Ciel-ÉVASION®"
        let destination = ['manolotsoa.randriambeloniaina@gmail.com','zelotobey@gmail.com']

        return await this.send(emailData, path_template, destination, objet);
    }

    async send(emailData, path_template, destination, objet) {
        let htmlTemplate = fs.readFileSync(path_template, "utf8");
        for (const key in emailData) {
            if(emailData[key] !== null && emailData[key] !== undefined) {
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, emailData[key]);
            }else{
                let regex = new RegExp(`{{${key}}}`, "g");
                htmlTemplate = htmlTemplate.replace(regex, '...');
            }
        }
        const resend = new Resend(await this.ResendApiKey());

        return await resend.emails.send({
            from: await this.ResendDomain(),
            to: destination,
            subject: objet,
            html: htmlTemplate,
        });
    }

    /*
      async refresh() {
        return await refreshData(wixData_url);
      }
      async getAll() {
        return await FullData(wixData_url);
      }
    
      async getById(id) {
        return (await get_wix_services(wixData_url + "_id/" + id)).data;
      }
    
      async getByEmail(email) {
        return (await this.getAll()).find((item) => item.loginEmail === email);
      }
    */
}

export default new EmailService();
