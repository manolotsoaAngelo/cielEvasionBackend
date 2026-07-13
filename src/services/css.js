/*
import CssService from "../services/css.js";
*/
import fs from "fs";

import {
  FullData, init_cachedData_avis,
  refreshData,
} from "../utils/fullData/avis.js";

function capitalize(word) {
  return word ? word.charAt(0).toUpperCase() + word.slice(1) : null;
}
function generateShortContent(content, maxLength = 60) {
  if (content.length <= maxLength) return content;

  return content.substring(0, maxLength).trim() + "...";
}

class CssService {
  constructor() {
  }

  async refresh_avis() {
    return await refreshData();
  }
  async getAll_avis() {

    let result = []
    let all_avis_csv = (await FullData())

    all_avis_csv.forEach((avis, index) => {
      if (avis.contenuDeLAvis1) {
        result.push({
          id: index,
          name: avis.nomDeLAuteur1,
          profilePic: avis.photoDeProfil1,
          images: avis.photos1 ? avis.photos1 : [],
          rating: avis.noteSur51,
          date: avis.dateDeLAvis1,
          source: (avis.source).replace(" ", "_"),
          sourceName: capitalize(avis.source),
          content: avis.contenuDeLAvis1 ? avis.contenuDeLAvis1 : "",
          shortContent: avis.contenuDeLAvis1 ? generateShortContent(avis.contenuDeLAvis1, 60) : ""
        })
      }
    })

    return result
  }

  // section : comp-m56sapad // contenu du section : comp-mmk94ljq

  ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_section_admin_hauteux_max" defer></script>

  async section_admin_hauteux_max() {

    let css = `(function () {
    const css = \`
        @media screen and (min-width: 1000px) {
            section#comp-m56sapad {
                height: 200px !important;
                min-height: 200px !important;
            }
        }
    \`;

    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));

    document.head.appendChild(style);
})();`;

    return css.replace(/\s+/g, " ")
  }

  async avis_Client_full_body() {
    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_avis_Client_full_body_Byserver" defer></script>

    let htmlString = fs.readFileSync("src/utils/css/avis/avis_html_v1.html", "utf8");
    let all_avis = await this.getAll_avis();
    let script = `<!DOCTYPE html><script>
        const reviews = ${JSON.stringify(all_avis)};
        </script>`;
    return (script + htmlString).replace(/\s+/g, " ")
  }

  async partenaires_header_footer_body_fix() {
    //"https://ciel-evasion.fr/_functions/WixCss/get_css_partenaires_header_footer_body_fix"
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
#comp-mceqgvd0,
#comp-m59icq1u,
#comp-m56rqvpq,
#comp-mdznalu2 {
  box-sizing: border-box;
  min-height: 100vh !important;
  height: auto !important;
  width: 100% !important;
}

html { scroll-behavior: smooth; }
body { margin: 0; }
\`;

const styleTag = document.createElement('style');
styleTag.textContent = cssContent;
document.head.appendChild(styleTag);

function adjustContentPadding() {
    const headers = [
        "comp-mdiw6s9o","comp-m59ic5d3","comp-m56uvovw","comp-mdzn7y3o"
    ].map(id => document.getElementById(id));
    const contents = [
        "comp-mceqgvd0","comp-m59icq1u","comp-m56rqvpq","comp-mdznalu2"
    ].map(id => document.getElementById(id));

    let maxHeaderHeight = 0;

    headers.forEach(h => { if(h) maxHeaderHeight = Math.max(maxHeaderHeight, h.offsetHeight); });

    contents.forEach(c => {
        if(c) {
            c.style.paddingTop = maxHeaderHeight + "px";
        }
    });
}

const retryInterval = setInterval(() => {
    adjustContentPadding();
    const allLoaded =
        document.getElementById("comp-mdiw6s9o") &&
        document.getElementById("comp-mceqgvd0");
    if (allLoaded) clearInterval(retryInterval);
}, 200);

const resizeObserver = new ResizeObserver(() => {
    adjustContentPadding();
});

setTimeout(() => {
    [
        "comp-mdiw6s9o","comp-m59ic5d3","comp-m56uvovw","comp-mdzn7y3o"
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) resizeObserver.observe(el);
    });
}, 1500);

window.addEventListener("load", adjustContentPadding);
window.addEventListener("resize", adjustContentPadding);

function onNavigated(callback) {
  let lastUrl = location.href;

  const push = history.pushState;
  history.pushState = function() {
    push.apply(history, arguments);
    callback();
  };

  const replace = history.replaceState;
  history.replaceState = function() {
    replace.apply(history, arguments);
    callback();
  };

  window.addEventListener("popstate", callback);

  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      callback();
    }
  }, 300);
}

function runWhenReady(fn) {
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      observer.disconnect();
      fn();
    }, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

onNavigated(() => {
  window.addEventListener("load", () => {
    runWhenReady(adjustContentPadding);
  });

  runWhenReady(adjustContentPadding);
});
`

    return css.replace(/\s+/g, " ")
  }

  async importateur_header_fix() {
    //"https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix"
    ///<link rel="stylesheet" href="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix">
    ///Head : comp-mhytj3e7,comp-mi2u0prw, comp-mlj3ty9h
    ///Contenu : comp-lvw159ib,comp-lvw159l6,comp-lvw159qs   ///,comp-lvw159id, comp-lvw159if 

    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix" defer></script>

    let css = `const cssContent = \`
#comp-mhytj3e7,
#comp-mi2u0prw,
#comp-mlj3ty9h
 {
  position:fixed!important;
  top:0;left:0;
  width:100%;
  z-index:10000;
  background:inherit;
}
#comp-lvw159ib,
#comp-lvw159l6,
#comp-lvw159qs
 {
  box-sizing:border-box;
  min-height:100vh!important;
  height:auto!important;
  width:100%!important;
}
html{scroll-behavior:smooth;}
body{margin:0;}
\`;

const style=document.createElement("style");
style.textContent=cssContent;
document.head.appendChild(style);

function adjust(){
  const headers = ["comp-mhytj3e7","comp-mi2u0prw", "comp-mlj3ty9h"]
    .map(id => document.getElementById(id));

  const contents = ["comp-lvw159ib","comp-lvw159l6","comp-lvw159qs"]
    .map(id => document.getElementById(id));

  let h = 0;
  headers.forEach(e => {
    if (e) h = Math.max(h, e.offsetHeight);
  });

  contents.forEach(c => {
    if (!c) return;

    if (!c.__paddingInit) {
      c.style.transition = "padding-top 0.35s ease";
      c.__paddingInit = true;
    }

    requestAnimationFrame(() => {
      c.style.paddingTop = h + "px";
    });
  });
}

const init=setInterval(()=>{
  adjust();
  if(document.getElementById("comp-mhytj3e7")&&document.getElementById("comp-lvw159ib")||document.getElementById("comp-mi2u0prw")&&document.getElementById("comp-lvw159l6")||document.getElementById("comp-mlj3ty9h")&&document.getElementById("comp-lvw159qs"))clearInterval(init)
},200);

  const resizeObserver = new ResizeObserver(() => {
    adjust();
});

setTimeout(() => {
    [
        "comp-mhytj3e7","comp-mi2u0prw", "comp-mlj3ty9h",
        "comp-lvw159ib","comp-lvw159l6","comp-lvw159qs"
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) resizeObserver.observe(el);
    });
}, 1500);

window.addEventListener("load",adjust);
window.addEventListener("resize",adjust);

function onNavigated(callback) {
  let lastUrl = location.href;

  const push = history.pushState;
  history.pushState = function() {
    push.apply(history, arguments);
    callback();
  };

  const replace = history.replaceState;
  history.replaceState = function() {
    replace.apply(history, arguments);
    callback();
  };

  window.addEventListener("popstate", callback);

  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      callback();
    }
  }, 300);
}

function runWhenReady(fn) {
  let timeout;
  const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      observer.disconnect();
      fn();
    }, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

onNavigated(() => {
  window.addEventListener("load", () => {
    runWhenReady(adjust);
  });

  runWhenReady(adjust);
});
`
    return css.replace(/\s+/g, " ")
  }
}

export default new CssService();
