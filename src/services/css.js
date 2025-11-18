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
    //"https://ciel-evasion.fr/_functions/WixCss/get_css_partenaires_header_footer_body_fix"
    ///<link rel="stylesheet" href="https://ciel-evasion.fr/_functions/WixCss/get_css_partenaires_header_footer_body_fix">

    let css = `
@media (min-width: 1025px) {
  #comp-mdiw6s9o,
  #comp-m59ic5d3,
  #comp-m56uvovw,
  #comp-mdzn7y3o {
    position: fixed !important;
    inset: 0 auto auto 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mdiw7w5g2,
  #comp-m59ieqh9,
  #comp-m59ob8a72,
  #comp-mdznowf0 {
    position: fixed !important;
    inset: auto auto 0 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mceqgvd0,
  #comp-m59icq1u,
  #comp-m56rqvpq,
  #comp-mdznalu2 {
    padding-top: 120px;
    padding-bottom: 25px;
    box-sizing: border-box;
  }
}

@media (max-width: 1024px) {
  #comp-mdiw6s9o,
  #comp-m59ic5d3,
  #comp-m56uvovw,
  #comp-mdzn7y3o {
    position: fixed !important;
    inset: 0 auto auto 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mdiw7w5g2,
  #comp-m59ieqh9,
  #comp-m59ob8a72,
  #comp-mdznowf0 {
    position: fixed !important;
    inset: auto auto 0 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mceqgvd0,
  #comp-m59icq1u,
  #comp-m56rqvpq,
  #comp-mdznalu2 {
    padding-top: 90px;
    padding-bottom: 20px;
    box-sizing: border-box;
  }
}

@media (max-width: 640px) {
  #comp-mdiw6s9o,
  #comp-m59ic5d3,
  #comp-m56uvovw,
  #comp-mdzn7y3o {
    position: fixed !important;
    inset: 0 auto auto 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mdiw7w5g2,
  #comp-m59ieqh9,
  #comp-m59ob8a72,
  #comp-mdznowf0 {
    position: fixed !important;
    inset: auto auto 0 0;
    width: 100%;
    z-index: 10000;
    background: inherit;
    transform: translateZ(0);
  }

  #comp-mceqgvd0,
  #comp-m59icq1u,
  #comp-m56rqvpq,
  #comp-mdznalu2 {
    padding-top: 70px;
    padding-bottom: 18px;
    box-sizing: border-box;
  }
}

html {
  scroll-behavior: smooth;
}
`
    return css
  }

  async importateur_header_fix() {
    //"https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix"
    ///<link rel="stylesheet" href="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix">
    ///Head : comp-mhytj3e7
    ///Contenu : comp-lvw159ib, comp-lvw159id, comp-lvw159if

    let css = `
    #comp-mhytj3e7,#comp-mi2u0prw {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: inherit;
}

#comp-lvw159ib,#comp-lvw159l6 {
  padding-top: calc(120px + 80px + 20px);
  box-sizing: border-box;
}

#comp-lvw159id,
#comp-lvw159if {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

`
    return css
  }
}

export default new CssService();
