import fs from "fs";
import EbilletsService from "../../../services/ebillets.js";

export async function pop_rdv_css() {

  let htmlString = fs.readFileSync("src/utils/css/pop_rdv/rdv.html", "utf8");
  let all_ebillet = await EbilletsService.getAll();
  let script = `<!DOCTYPE html><script>
     all_ebillet = ${JSON.stringify(all_ebillet)};
        </script>`;
  return { html: (script + htmlString).replace(/\s+/g, " ") }
  //return (script + htmlString).replace(/\s+/g, " ")
}