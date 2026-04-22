import fs from "fs";
import path from "path";
import UsersService from "../services/users.js";
import BrevoService from "../services/brevo.js";

class EmailService {
    constructor() {
    }

    async emailAdmin() {
        ///return ['manolotsoa.randriambeloniaina@gmail.com', 'zelotobey@gmail.com', 'holiniainaprisca566@gmail.com', 'contact@ciel-evasion.fr']
        return ['manolotsoa.randriambeloniaina@gmail.com', 'zelotobey@gmail.com', 'contact@ciel-evasion.fr']
        //return ['manolotsoa.randriambeloniaina@gmail.com', 'contact@ciel-evasion.fr']
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

    async email_contrepropositions(data) {
        let objet = "Contre-proposition de rendez-vous - CIEL ÉVASION"
        let path_template = path.join(
            process.cwd(),
            "src",
            "utils",
            "templateEmail",
            "email_contrepropositions.html"
        );

        let All_date = (data.data).All_date
        let date_option = ""
        let option = ["A", "B", "C"]
        for (let [index, date] of All_date.entries()) {
            date_option += `<div class="date-option">
                    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
                        <tr>
                            <td style="padding:15px 20px;" class="date-info">📅 ${date}</td>
                            <td style="padding:15px 20px; text-align:right;" class="mobile-stack">
                                <span class="date-tag">Option ${option[index]}</span>
                            </td>
                        </tr>
                    </table>
                </div>`
        }

        (data.data).options = date_option

        let htmlTemplate = await this.init_data_html_template(path_template, data.data);

        return await this.send(htmlTemplate, objet, data.destinataire);
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

    async send(htmlTemplate, objet, userId) {
        try {
            const [user, adminEmails] = await Promise.all([
                UsersService.getById(userId),
                this.emailAdmin()
            ]);
            if (!user?.loginEmail) {
                throw new Error("Email utilisateur introuvable");
            }
            if (!adminEmails?.length) {
                throw new Error("Aucun email admin configuré");
            }
            //const expediteur = adminEmails[0];
            const expediteur = process.env.BREVO_SENDER_EMAIL;
            const destinataires = [
                ...new Set([...adminEmails, user.loginEmail])
            ].filter(Boolean);
            const results = await Promise.all(
                destinataires.map(email =>
                    BrevoService.send(htmlTemplate, objet, expediteur, email)
                )
            );
            return results;

        } catch (error) {
            console.error("Erreur envoi emails multiples:", error);
            return [{
                success: false,
                error: error.message
            }];
        }
    }

}

export default new EmailService();
