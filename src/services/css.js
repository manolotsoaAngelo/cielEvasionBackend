/*
import CssService from "../services/css.js";
*/
import fs from "fs";

import {
  FullData, init_cachedData_avis,
  refreshData,
} from "../utils/fullData/avis.js";
class CssService {
  constructor() {
  }

  async refresh_avis() {
    return await refreshData();
  }
  async getAll_avis() {
    return await FullData();
  }

  async codejs_load_page() {
    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_codejs_load_page" defer></script>

    let jsCode = `
    
    (function () {
    const MIN_DISPLAY_TIME = 5000;
    const FADE_DURATION = 500;
    const startTime = Date.now();

    const css = \`
    #page-loader {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(4px);
        z-index: 999999;
        opacity: 1;
        visibility: visible;
        transition: opacity \${FADE_DURATION}ms ease, visibility \${FADE_DURATION}ms ease;
    }

    #page-loader.hide {
        opacity: 0;
        visibility: hidden;
    }

    .loader-box {
        position: relative;
        width: 120px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 6px solid rgba(255,255,255,.5);
        border-top: 6px solid #fff;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    \`;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.innerHTML = \`
        <div class="loader-box">
            <div class="spinner"></div>
        </div>
    \`;

    document.body.appendChild(loader);

    const showLoader = () => {
        loader.classList.remove("hide");
    };

    const hideLoader = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(MIN_DISPLAY_TIME - elapsed, 0);

        setTimeout(() => {
            loader.classList.add("hide");
        }, remaining);
    };

    showLoader();

    window.addEventListener("message", function (event) {
        if (event.data === "showLoader") {
            showLoader();
        } else if (event.data === "hideLoader") {
            hideLoader();
        }
    });

})();

    `
    return jsCode.replace(/\s+/g, " ")
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

(function () {
  const MIN_DISPLAY_TIME = 800;
  const FADE_DURATION = 500;
  const startTime = Date.now();

  const css = \`
    #page-loader{
      position:fixed;
      inset:0;
      display:flex;
      justify-content:center;
      align-items:center;
      background:linear-gradient(180deg,#87ceeb 0%,#e0f7ff 100%);
      z-index:999999;
      transition:opacity \${FADE_DURATION}ms ease, visibility \${FADE_DURATION}ms ease;
    }
    #page-loader.hide{
      opacity:0;
      visibility:hidden;
    }
    .loader-box{
      position:relative;
      width:120px;
      height:80px;
      display:flex;
      justify-content:center;
      align-items:center;
    }
    .spinner{
      position:absolute;
      width:70px;
      height:70px;
      border-radius:50%;
      border:6px solid rgba(255,255,255,.5);
      border-top:6px solid #ffffff;
      animation:spin 1s linear infinite;
      box-shadow:0 0 25px rgba(0,0,0,.08);
    }
    .cloud{
      font-size:48px;
      animation:float 2.5s ease-in-out infinite;
    }
    @keyframes spin{
      to{transform:rotate(360deg)}
    }
    @keyframes float{
      0%,100%{transform:translateY(0)}
      50%{transform:translateY(-10px)}
    }
  \`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const loader = document.createElement("div");
  loader.id = "page-loader";
  loader.innerHTML = \`
    <div class="loader-box">
      <div class="spinner"></div>
    </div>
  \`;
  document.body.appendChild(loader);

  const hideLoader = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(MIN_DISPLAY_TIME - elapsed, 0);
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), FADE_DURATION);
    }, remaining);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader);
  }
})();

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
