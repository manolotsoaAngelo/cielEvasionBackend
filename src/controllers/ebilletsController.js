let Ebilletss = []; // Mémoire (tu peux remplacer par DB ou fichier)

export function getEbillets(req, res) {
  res.json(Ebilletss);
}

export function pushEbillets(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Ebillets requis" });

  const newEbillets = { id: Date.now(), text };
  Ebilletss.push(newEbillets);
  res.status(201).json(newEbillets);
}
