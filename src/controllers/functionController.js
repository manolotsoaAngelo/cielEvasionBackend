import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { crypter, decrypter } from '../utils/cryptographie/cryptographie.js'

export async function runFunction(req, res) {
    const { data } = (req.body);
    if (!data) return res.status(400).json({ error: "données requis" });
    /*
    let result
    switch (data.typeFunction) {
        case 'crypter':
            result = crypter(data.valeur)
            break;
            case 'decrypter':
            result = decrypter(data.valeur)
            break;
    
        default:
            break;
    }
*/
    res.status(201).json((data));
}
