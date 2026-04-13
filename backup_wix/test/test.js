import OrdersService from "../../src/services/orders.js";
import AiService from "../../src/services/ai.js";

export async function test() {
  let num = 11538
 console.log(await OrdersService.get_nom_prenom_byOrder(num)) 
}

test()