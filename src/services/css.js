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
    ///Head : comp-mhytj3e7
    ///Contenu : comp-lvw159ib, comp-lvw159id, comp-lvw159if

    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix" defer></script>

    let css = `let css = \`
#comp-mhytj3e7 {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  background: inherit;
}

#comp-lvw159ib,
#comp-lvw159id,
#comp-lvw159if {
  box-sizing: border-box;
  min-height: 100vh !important;
  height: auto !important;
  width: 100% !important;
}

html { scroll-behavior: smooth; }
body { margin: 0; }
\`;

const styleTag=document.createElement('style');
styleTag.textContent=css;
document.head.appendChild(styleTag);

function adjustContentPadding(){
  const header=document.getElementById("comp-mhytj3e7");
  const contents=["comp-lvw159ib","comp-lvw159id","comp-lvw159if"].map(id=>document.getElementById(id));
  const h=header?header.offsetHeight:0;
  contents.forEach(c=>{if(c)c.style.paddingTop=h+"px";});
}

const retry=setInterval(()=>{
  adjustContentPadding();
  if(document.getElementById("comp-mhytj3e7")&&document.getElementById("comp-lvw159ib"))clearInterval(retry);
},200);

const ro=new ResizeObserver(()=>adjustContentPadding());
setTimeout(()=>{
  const h=document.getElementById("comp-mhytj3e7");
  if(h)ro.observe(h);
},1500);

window.addEventListener("load",adjustContentPadding);
window.addEventListener("resize",adjustContentPadding);

function onNavigated(cb){
  let u=location.href;
  const p=history.pushState;
  history.pushState=function(){p.apply(history,arguments);cb();};
  const r=history.replaceState;
  history.replaceState=function(){r.apply(history,arguments);cb();};
  window.addEventListener("popstate",cb);
  setInterval(()=>{if(location.href!==u){u=location.href;cb();}},300);
}

function runWhenReady(fn){
  let t;
  const o=new MutationObserver(()=>{
    clearTimeout(t);
    t=setTimeout(()=>{o.disconnect();fn();},100);
  });
  o.observe(document.body,{childList:true,subtree:true});
}

onNavigated(()=>{
  window.addEventListener("load",()=>{runWhenReady(adjustContentPadding);});
  runWhenReady(adjustContentPadding);
});

`
    return css.replace(/\s+/g, " ")
  }
}

export default new CssService();
