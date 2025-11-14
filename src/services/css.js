//import UsersService from '../services/users.js';
import { get_wix_services } from "../utils/wixData/wixHttp.js";
import { FullData } from "../utils/fullData/users.js";
import { init_cachedData_users, refreshData } from "../utils/fullData/users.js";
let wixData_url = "https://ciel-evasion.fr/_functions/WixData/all_member/";
let collection_name = "Membre_everyone";
let wixData_url_get_FullData =
    "https://ciel-evasion.fr/_functions/WixData/" + collection_name + "/";

class CssService {
    constructor() {
    }
    async partenaires_header_footer_body_fix() {
      //"https://ciel-evasion.fr/_functions/get_WixCss/partenaires_header_footer_body_fix"
      ///<link rel="stylesheet" href="https://ciel-evasion.fr/_functions/get_WixCss/partenaires_header_footer_body_fix">

      let css="<style>\n#comp-mdiw6s9o,\n#comp-m59ic5d3,\n#comp-m56uvovw,\n#comp-mdzn7y3o {\n  position: fixed !important;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 10000;\n  background: inherit;\n}\n\n#comp-mdiw7w5g2,\n#comp-m59ieqh9,\n#comp-m59ob8a72,\n#comp-mdznowf0 {\n  position: fixed !important;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  z-index: 10000;\n  background: inherit;\n}\n\n#comp-mceqgvd0,\n#comp-m59icq1u,\n#comp-m56rqvpq,\n#comp-mdznalu2 {\n  padding-top: 120px;\n  padding-bottom: 100px;\n  box-sizing: border-box;\n}\n\nhtml {\n  scroll-behavior: smooth;\n}\n</style>";
        return css
    }
}

export default new CssService();
