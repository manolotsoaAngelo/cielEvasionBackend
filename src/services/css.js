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

    let css = `const cssContent = \`
/* HEADERS */
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
  transition: transform 0.3s ease;
}

/* FOOTERS - Optimisé mobile */
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
  transform: translateY(0);
  transition: transform 0.3s ease;
  /* Assurer un bon rendu sur mobile */
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  /* Safe area pour iPhone avec notch */
  padding-bottom: env(safe-area-inset-bottom, 0px) !important;
}

/* CONTENU PRINCIPAL */
#comp-mceqgvd0,
#comp-m59icq1u,
#comp-m56rqvpq,
#comp-mdznalu2 {
  box-sizing: border-box;
  min-height: 100vh !important;
  min-height: -webkit-fill-available !important; /* Pour mobile */
  height: auto !important;
  width: 100% !important;
  /* Transition pour éviter les sauts */
  transition: padding 0.3s ease;
}

/* Masquer le footer au scroll (optionnel pour mobile) */
.footer-hidden {
  transform: translateY(100%) !important;
}

html { 
  scroll-behavior: smooth;
  /* Améliorer le scrolling sur mobile */
  -webkit-overflow-scrolling: touch;
}

body { 
  margin: 0;
  /* Prévenir le zoom sur iOS */
  touch-action: pan-y;
}

/* Media query pour mobile */
@media (max-width: 768px) {
  /* Ajustements spécifiques mobile */
  #comp-mdiw7w5g2,
  #comp-m59ieqh9,
  #comp-m59ob8a72,
  #comp-mdznowf0 {
    /* Assurer que le footer n'est pas trop grand sur mobile */
    max-height: 70px;
    overflow: hidden;
  }
  
  /* Optimiser le padding sur mobile */
  #comp-mceqgvd0,
  #comp-m59icq1u,
  #comp-m56rqvpq,
  #comp-mdznalu2 {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
}

/* Pour très petits écrans */
@media (max-width: 480px) {
  #comp-mdiw7w5g2,
  #comp-m59ieqh9,
  #comp-m59ob8a72,
  #comp-mdznowf0 {
    /* Réduire encore plus si nécessaire */
    max-height: 60px;
  }
}
\`;

const styleTag = document.createElement('style');
styleTag.textContent = cssContent;
document.head.appendChild(styleTag);

// Variables globales pour la gestion mobile
let isMobile = window.innerWidth <= 768;
let lastScrollTop = 0;
const SCROLL_THRESHOLD = 100; // Seuil pour masquer/afficher le footer

function adjustContentPadding() {
    const headers = [
        "comp-mdiw6s9o", "comp-m59ic5d3", "comp-m56uvovw", "comp-mdzn7y3o"
    ].map(id => document.getElementById(id));
    
    const footers = [
        "comp-mdiw7w5g2", "comp-m59ieqh9", "comp-m59ob8a72", "comp-mdznowf0"
    ].map(id => document.getElementById(id));
    
    const contents = [
        "comp-mceqgvd0", "comp-m59icq1u", "comp-m56rqvpq", "comp-mdznalu2"
    ].map(id => document.getElementById(id));

    let maxHeaderHeight = 0;
    let maxFooterHeight = 0;

    headers.forEach(h => { 
        if(h) maxHeaderHeight = Math.max(maxHeaderHeight, h.offsetHeight); 
    });
    
    footers.forEach(f => { 
        if(f) maxFooterHeight = Math.max(maxFooterHeight, f.offsetHeight); 
    });

    // Ajuster le padding avec des valeurs minimales pour mobile
    const minPadding = isMobile ? 10 : 0;
    const paddingTop = Math.max(maxHeaderHeight, minPadding);
    const paddingBottom = Math.max(maxFooterHeight, minPadding);

    contents.forEach(c => {
        if(c) {
            c.style.paddingTop = paddingTop + "px";
            c.style.paddingBottom = paddingBottom + "px";
        }
    });
    
    // Retourner les dimensions pour une utilisation externe si nécessaire
    return { maxHeaderHeight, maxFooterHeight };
}

// Gestion du scroll pour mobile (masquer/afficher le footer)
function handleMobileScroll() {
    if (!isMobile) return;
    
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const footers = [
        "comp-mdiw7w5g2", "comp-m59ieqh9", "comp-m59ob8a72", "comp-mdznowf0"
    ].map(id => document.getElementById(id)).filter(Boolean);
    
    // Masquer le footer quand on scroll vers le bas, l'afficher quand on remonte
    if (currentScroll > lastScrollTop && currentScroll > SCROLL_THRESHOLD) {
        // Scroll vers le bas
        footers.forEach(footer => {
            footer.classList.add('footer-hidden');
        });
    } else {
        // Scroll vers le haut ou en haut de page
        footers.forEach(footer => {
            footer.classList.remove('footer-hidden');
        });
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}

// Détection du changement de taille d'écran
function handleResize() {
    const newIsMobile = window.innerWidth <= 768;
    
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        
        // Réinitialiser l'état du footer sur changement de taille
        const footers = [
            "comp-mdiw7w5g2", "comp-m59ieqh9", "comp-m59ob8a72", "comp-mdznowf0"
        ].map(id => document.getElementById(id)).filter(Boolean);
        
        footers.forEach(footer => {
            footer.classList.remove('footer-hidden');
        });
        
        // Réajuster le padding
        adjustContentPadding();
    }
}

// Initialisation
function initFixedElements() {
    const retryInterval = setInterval(() => {
        adjustContentPadding();
        const allLoaded =
            document.getElementById("comp-mdiw6s9o") &&
            document.getElementById("comp-mdiw7w5g2") &&
            document.getElementById("comp-mceqgvd0");
        
        if (allLoaded) {
            clearInterval(retryInterval);
            
            // Ajouter l'événement de scroll pour mobile
            if (isMobile) {
                window.addEventListener('scroll', handleMobileScroll, { passive: true });
            }
            
            // Observer les changements de taille des éléments
            const resizeObserver = new ResizeObserver(() => {
                adjustContentPadding();
            });

            [
                "comp-mdiw6s9o", "comp-m59ic5d3", "comp-m56uvovw", "comp-mdzn7y3o",
                "comp-mdiw7w5g2", "comp-m59ieqh9", "comp-m59ob8a72", "comp-mdznowf0"
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el) resizeObserver.observe(el);
            });
        }
    }, 200);

    // Gestion des événements
    window.addEventListener("load", () => {
        adjustContentPadding();
        if (isMobile) {
            window.addEventListener('scroll', handleMobileScroll, { passive: true });
        }
    });
    
    window.addEventListener("resize", () => {
        adjustContentPadding();
        handleResize();
    });
    
    // Prévenir les erreurs de transition lors du chargement
    window.addEventListener('DOMContentLoaded', () => {
        document.body.style.overflowX = 'hidden';
    });
}

// Navigation SPA (si applicable)
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

// Initialisation principale
document.addEventListener('DOMContentLoaded', () => {
    initFixedElements();
    
    // Gestion de la navigation SPA
    onNavigated(() => {
        runWhenReady(() => {
            adjustContentPadding();
            // Réinitialiser le scroll sur mobile après navigation
            if (isMobile) {
                const footers = [
                    "comp-mdiw7w5g2", "comp-m59ieqh9", "comp-m59ob8a72", "comp-mdznowf0"
                ].map(id => document.getElementById(id)).filter(Boolean);
                
                footers.forEach(footer => {
                    footer.classList.remove('footer-hidden');
                });
                lastScrollTop = 0;
            }
        });
    });
});

// Détection de l'orientation sur mobile
window.addEventListener("orientationchange", () => {
    setTimeout(adjustContentPadding, 100);
});

// Fallback pour les vieux navigateurs
if (!('ResizeObserver' in window)) {
    const checkInterval = setInterval(adjustContentPadding, 1000);
    setTimeout(() => clearInterval(checkInterval), 10000);
}`

    return css.replace(/\s+/g, " ")
  }

  async importateur_header_fix() {
    //"https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix"
    ///<link rel="stylesheet" href="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix">
    ///Head : comp-mhytj3e7,comp-mi2u0prw
    ///Contenu : comp-lvw159ib,comp-lvw159l6 ,comp-lvw159id, comp-lvw159if

    ///<script src="https://ciel-evasion.fr/_functions/WixCss/get_css_importateur_header_fix" defer></script>

    let css = `const cssContent = \`
#comp-mhytj3e7,
#comp-mi2u0prw {
  position:fixed!important;
  top:0;left:0;
  width:100%;
  z-index:10000;
  background:inherit;
}
#comp-lvw159ib,
#comp-lvw159l6 {
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
  const headers=["comp-mhytj3e7","comp-mi2u0prw"].map(id=>document.getElementById(id));
  const contents=["comp-lvw159ib","comp-lvw159l6"].map(id=>document.getElementById(id));
  let h=0;headers.forEach(e=>{if(e)h=Math.max(h,e.offsetHeight)});
  contents.forEach(c=>{if(c){c.style.paddingTop=h+"px"}});
}

const init=setInterval(()=>{
  adjust();
  if(document.getElementById("comp-mhytj3e7")&&document.getElementById("comp-lvw159ib"))clearInterval(init)
},200);

window.addEventListener("load",adjust);
window.addEventListener("resize",adjust);

function runReady(fn){
  let t;
  const o=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{o.disconnect();fn()},100)});
  o.observe(document.body,{childList:true,subtree:true});
}
runReady(adjust);
`

    return css.replace(/\s+/g, " ")
  }
}

export default new CssService();
