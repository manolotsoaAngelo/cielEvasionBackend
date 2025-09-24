import { tri_reportByASC_ref } from '../utils/crud/function.js';
import { compressed_obj, decompressed_obj } from '../utils/compression/compression.js'

let Ebilletss = []; // Mémoire (tu peux remplacer par DB ou fichier)

export function getEbillets(req, res) {
  res.json(Ebilletss);
}

export function tri_reportByASC_ref_Ebillets(req, res) {
  const { data } = decompressed_obj(req.body);
  if (!text) return res.status(400).json({ error: "données requis" });
    
  //const newEbillets = { id: Date.now(), text };
  //Ebilletss.push(newEbillets);
  res.status(201).json(compressed_obj(tri_reportByASC_ref(data)));
}
