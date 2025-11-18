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
    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_css_partenaires_header_footer_body_fix" defer></script>

    let css = `
    const cssContent = \`
#comp-mdiw6s9o,
#comp-m59ic5d3,
#comp-m56uvovw,
#comp-mdzn7y3o {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: inherit;
}
#comp-mdiw7w5g2,
#comp-m59ieqh9,
#comp-m59ob8a72,
#comp-mdznowf0 {
  position: fixed !important;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: inherit;
}
#comp-mceqgvd0,
#comp-m59icq1u,
#comp-m56rqvpq,
#comp-mdznalu2 {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
}
body {
  margin: 0;
}
\`;

const styleTag = document.createElement('style');
styleTag.textContent = cssContent;
document.head.appendChild(styleTag);

function adjustContentPadding() {
    const headers = [
        document.getElementById("comp-mdiw6s9o"),
        document.getElementById("comp-m59ic5d3"),
        document.getElementById("comp-m56uvovw"),
        document.getElementById("comp-mdzn7y3o")
    ];
    const footers = [
        document.getElementById("comp-mdiw7w5g2"),
        document.getElementById("comp-m59ieqh9"),
        document.getElementById("comp-m59ob8a72"),
        document.getElementById("comp-mdznowf0")
    ];
    const contents = [
        document.getElementById("comp-mceqgvd0"),
        document.getElementById("comp-m59icq1u"),
        document.getElementById("comp-m56rqvpq"),
        document.getElementById("comp-mdznalu2")
    ];

    let maxHeaderHeight = 0;
    let maxFooterHeight = 0;

    headers.forEach(h => { if(h) maxHeaderHeight = Math.max(maxHeaderHeight, h.offsetHeight); });
    footers.forEach(f => { if(f) maxFooterHeight = Math.max(maxFooterHeight, f.offsetHeight); });

    contents.forEach(c => {
        if(c) {
            c.style.paddingTop = maxHeaderHeight + "px";
            c.style.paddingBottom = maxFooterHeight + "px";
        }
    });
}

window.addEventListener("load", adjustContentPadding);
window.addEventListener("resize", adjustContentPadding);

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
