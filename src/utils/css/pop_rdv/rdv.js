import fs from "fs";
import EbilletsService from "../../../services/ebillets.js";

// Cache mémoire du template HTML pré-minifié pour éviter les I/O disque et regex répétitifs
let cachedHtmlParts = null;

function getHtmlParts() {
  if (!cachedHtmlParts) {
    const htmlPath = new URL("./rdv.html", import.meta.url);
    const rawHtml = fs.readFileSync(htmlPath, "utf8");
    // Pré-minification du template HTML statique une seule fois
    const minified = rawHtml.replace(/\s+/g, " ").trim();

    // Découpage avant </body> pour une injection propre et rapide
    if (minified.includes("</body>")) {
      const idx = minified.lastIndexOf("</body>");
      cachedHtmlParts = [minified.substring(0, idx), minified.substring(idx)];
    } else {
      cachedHtmlParts = [minified, ""];
    }
  }
  return cachedHtmlParts;
}

export function clear_rdv_html_cache() {
  cachedHtmlParts = null;
}

export async function pop_rdv_css() {
  const [headAndBody, closingBody] = getHtmlParts();

  let all_ebillet = [];
  try {
    const data = await EbilletsService.getAll();
    all_ebillet = Array.isArray(data) ? data : (data ? [data] : []);
  } catch (error) {
    console.error("Erreur lors de la récupération des e-billets dans pop_rdv_css :", error);
    all_ebillet = [];
  }

  // JSON.stringify est déjà compact et minifié ; protection contre la rupture de balise script
  const safeJson = JSON.stringify(all_ebillet).replace(/</g, "\\u003c");
  const scriptTag = `<script>all_ebillet=${safeJson};</script>`;

  return { html: `${headAndBody}${scriptTag}${closingBody}` };

  //return `${headAndBody}${scriptTag}${closingBody}`
}

/*
import fs from "fs";
import EbilletsService from "../../../services/ebillets.js";

export async function pop_rdv_css() {

  let htmlString = fs.readFileSync("src/utils/css/pop_rdv/rdv.html", "utf8");
  let all_ebillet = await EbilletsService.getAll();
  let script = `<!DOCTYPE html><script>
     all_ebillet = ${JSON.stringify(all_ebillet)};
        </script>`;
  return { html: (htmlString + script).replace(/\s+/g, " ") }
  //return (htmlString + script).replace(/\s+/g, " ")
}

*/