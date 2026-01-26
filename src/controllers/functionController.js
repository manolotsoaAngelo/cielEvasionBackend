import { tri_reportByASC_ref } from "../utils/crud/function.js";
import {
  compressed_obj,
  decompressed_obj,
} from "../utils/compression/compression.js";
import { crypter, decrypter } from "../utils/cryptographie/cryptographie.js";
import {
  chaine_opt_partenaire,
  chaine_opt,
  opt_reportByRef,
} from "../utils/tinyFunction/tinyFunction.js";
import { init_cachedData_ebillet } from "../utils/fullData/ebillets.js";
import { init_cachedData_orders } from "../utils/fullData/orders.js";
import { init_cachedData_partenaire } from "../utils/fullData/partenaires.js";
import { init_cachedData_users } from "../utils/fullData/users.js";
import { init_cachedData_avis } from "../utils/fullData/avis.js";

import EbilletsService from "../services/ebillets.js";
import OrdersService from "../services/orders.js";
import PartenairesService from "../services/partenaires.js";
import UsersService from "../services/users.js";
import CssService from "../services/css.js";
import EmailService from "../services/email.js";

///https://ciel-evasion-backend.vercel.app/api/function/runFunction

///import { services_post, services_get } from 'backend/modules/server/server'
///return await services_post("L2FwaS9mdW5jdGlvbi9ydW5GdW5jdGlvbg==", { typeFunction: 'opt_reportByRef', valeur: ref })

export async function runFunction(req, res) {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "données requis" });
  let value = decompressed_obj(data);
  let result;
  switch (value.typeFunction) {

    case "sendEmailDispo":
      result = await EmailService.sendEmailDispo(value.valeur);
      break;

    case "init_cachedData":
      switch (value.valeur) {
        case "ebillets":
          result = {
            init_cachedData_ebillet: init_cachedData_ebillet(),
          };
          EbilletsService.refresh();
          break;
        case "orders":
          result = {
            init_cachedData_orders: init_cachedData_orders(),
          };
          OrdersService.refresh();
          break;
        case "partenaires":
          result = {
            init_cachedData_partenaire: init_cachedData_partenaire(),
          };
          PartenairesService.refresh();
          break;
        case "users":
          result = {
            init_cachedData_users: init_cachedData_users(),
          };
          UsersService.refresh();
          break;
          case "avis":
          result = {
            init_cachedData_avis: init_cachedData_avis(),
          };
          CssService.refresh_avis();
          break;
        default:
          break;
      }
      break;

    ///Orders
    case "create_order_new":
      result = await OrdersService.create(value.valeur);
      break;

    case "tri_reportByASC_ref":
      result = await tri_reportByASC_ref(value.valeur);
      break;

    case "chaine_opt":
      result = await chaine_opt(value.valeur);
      break;

    case "opt_reportByRef":
      result = await opt_reportByRef(value.valeur);
      break;

    case "chaine_opt_partenaire":
      result = await chaine_opt_partenaire(value.valeur);
      break;

    case "crypter":
      result = crypter(value.valeur);
      break;

    case "decrypter":
      result = decrypter(value.valeur);
      break;

    case "compressed_obj":
      result = compressed_obj(value.valeur);
      break;

    case "decompressed_obj":
      result = decompressed_obj(value.valeur);
      break;
      
    default:
      break;
  }
  res.status(201).json(compressed_obj(result));
}
