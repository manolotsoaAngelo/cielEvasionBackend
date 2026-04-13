import wixWindow from 'wix-window';

$w.onReady(() => {
  const ctx = wixWindow.lightbox.getContext() || {};

  // 📩 Envoie les infos à l’HTML
  $w('#htmlSms').postMessage({
    nom: ctx.nom,
    ref: ctx.ref,
    numero: ctx.numero
  });

  // 📱 Détection iPhone / iPad
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // 🧩 Écoute la demande de fermeture depuis le HTML
  $w('#htmlSms').onMessage((event) => {
    if (event?.data === 'close' || event?.data?.type === 'close') {
      wixWindow.lightbox.close();
    }
  });

  // ⏳ Fermeture automatique uniquement si ce n’est PAS un iPhone/iPad
  if (!isIOS) {
    setTimeout(() => {
      try { wixWindow.lightbox.close(); } catch (_) {}
    }, 7000);
  }
});
