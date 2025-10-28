import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

import EbilletsService from '../services/ebillets.js';

//console.log(await EbilletsService.getByidArticle("27f91f30-a07d-005f-6b44-894cd81c9b2d"))
//console.log(await EbilletsService.getByRef("E10742-1"))
//console.log(await EbilletsService.getById('6650005f-61b4-497f-8cca-2e8b08299fe3'))
console.log(await EbilletsService.getAll())
//console.log(await EbilletsService.getAllEbilletByPartenaire("15d9204a-b1d1-4288-8e5e-24e0fde1b8d3"))

export async function get_all_ebillet(req, res) {
    let all_ebillet_data = await EbilletsService.getAll();
    res.json(compressed_obj(all_ebillet_data));
}