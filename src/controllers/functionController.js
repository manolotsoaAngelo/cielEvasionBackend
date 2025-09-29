import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'
import { crypter, decrypter } from '../utils/cryptographie/cryptographie.js'

export async function runFunction(req, res) {
    const { data } = (req.body);
    if (!data) return res.status(400).json({ error: "données requis" });
    let value = decompressed_obj(data)
    let result
    switch (value.typeFunction) {
        case 'crypter':
            result = crypter(value.valeur)
            break;
        case 'decrypter':
            result = decrypter(value.valeur)
            break;
        case 'compressed_obj':
            result = compressed_obj(value.valeur)
            break;
        case 'decompressed_obj':
            result = decompressed_obj(value.valeur)
            break;
        default:
            break;
    }
    res.status(201).json(compressed_obj(result));
}
