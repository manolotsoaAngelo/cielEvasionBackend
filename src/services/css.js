/*
import CssService from "../services/css.js";
*/
class CssService {
  constructor() {
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
    const footers = [
        "comp-mdiw7w5g2","comp-m59ieqh9","comp-m59ob8a72","comp-mdznowf0"
    ].map(id => document.getElementById(id));
    const contents = [
        "comp-mceqgvd0","comp-m59icq1u","comp-m56rqvpq","comp-mdznalu2"
    ].map(id => document.getElementById(id));

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

const retryInterval = setInterval(() => {
    adjustContentPadding();
    const allLoaded =
        document.getElementById("comp-mdiw6s9o") &&
        document.getElementById("comp-mdiw7w5g2") &&
        document.getElementById("comp-mceqgvd0");
    if (allLoaded) clearInterval(retryInterval);
}, 200);

const resizeObserver = new ResizeObserver(() => {
    adjustContentPadding();
});

setTimeout(() => {
    [
        "comp-mdiw6s9o","comp-m59ic5d3","comp-m56uvovw","comp-mdzn7y3o",
        "comp-mdiw7w5g2","comp-m59ieqh9","comp-m59ob8a72","comp-mdznowf0"
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
    ///Head : comp-mhytj3e7,comp-mi2u0prw
    ///Contenu : comp-lvw159ib, comp-lvw159id, comp-lvw159if,comp-lvw159l6

    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix" defer></script>

    let css = `const cssContent = \`
#comp-mhytj3e7,
#comp-mi2u0prw {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: inherit;
}

/* CONTENUS : AUCUN PADDING GLOBAL */
#comp-lvw159ib,
#comp-lvw159id,
#comp-lvw159if,
#comp-lvw159l6 {
  box-sizing: border-box;
  min-height: 100vh !important;
  height: auto !important;
  width: 100% !important;
  padding: 0 !important;
}

html { scroll-behavior: smooth; }
body { margin: 0; }
\`;

const style = document.createElement("style");
style.textContent = cssContent;
document.head.appendChild(style);

function adjust() {
  const headers = [
    "comp-mhytj3e7",
    "comp-mi2u0prw"
  ].map(id => document.getElementById(id)).filter(Boolean);

  const contents = [
    "comp-lvw159ib",
    "comp-lvw159id",
    "comp-lvw159if",
    "comp-lvw159l6"
  ].map(id => document.getElementById(id)).filter(Boolean);

  let headerHeight = 0;
  headers.forEach(h => {
    headerHeight = Math.max(headerHeight, h.offsetHeight);
  });

  contents.forEach(c => {
    c.style.paddingTop = headerHeight + "px"; // ✅ SEULEMENT le top
  });
}

const init = setInterval(() => {
  adjust();
  if (
    document.getElementById("comp-mhytj3e7") &&
    document.getElementById("comp-lvw159ib")
  ) clearInterval(init);
}, 200);

window.addEventListener("load", adjust);
window.addEventListener("resize", adjust);

function runReady(fn) {
  let t;
  const o = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => {
      o.disconnect();
      fn();
    }, 100);
  });
  o.observe(document.body, { childList: true, subtree: true });
}
runReady(adjust);


`

    return css.replace(/\s+/g, " ")
  }
}

export default new CssService();
