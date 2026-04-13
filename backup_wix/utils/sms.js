<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>SMS automatique</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      color: #333;
      background: #fff;
      text-align: center;
    }
    #status { font-size: 16px; line-height: 1.4; margin-bottom: 20px; }
    #manualBtn {
      display: none; background-color: #d62828; color: #fff;
      padding: 10px 25px; border: none; border-radius: 6px;
      font-size: 15px; font-weight: bold; cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    #manualBtn:hover { background-color: #b51f1f; transform: scale(1.03); }
    a#hiddenSms { display: none; }
  </style>
</head>

<body>
  <div id="status">📱 Ouverture de l’application Messages...</div>
  <button id="manualBtn">Ouvrir Messages</button>
  <a id="hiddenSms" href="#">sms</a>

  <script>
    (function () {
      let numero = "+33612345678";
      let nom    = "{Nom du bénéficiaire}";
      // ⚠️ IMPORTANT: `ref` doit déjà être encodé pour l’URL (ex: "RTI4...%3D%3D")
      let ref    = "{n° de e-Billet}";
      let launched = false;
      let autoCloseEnabled = false;

      const status    = document.getElementById("status");
      const hiddenSms = document.getElementById("hiddenSms");
      const manualBtn = document.getElementById("manualBtn");
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      // Bonjour/Bonsoir selon l'heure de Paris
      function getGreetingParts() {
        const heureParis = new Date().toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          hour12: false
        });
        const h = parseInt(heureParis, 10);
        return h < 18 ? { greet: "Bonjour", timeWord: "journée" }
                      : { greet: "Bonsoir", timeWord: "soirée" };
      }

      // Corps du SMS avec tes 2 liens EXACTS et `ref` tel quel (PAS re-encodé)
      const messageTemplate = () => {
        const { greet, timeWord } = getGreetingParts();
        return `${greet} ${nom},
La météo ne permet malheureusement pas le vol en montgolfière.
J’attendais les dernières prévisions avant de vous confirmer l’annulation.

📩 Vous recevez un lien par e-Billet dans un SMS.

👉 Si vous avez plusieurs e-Billets, il faut cliquer sur le lien de chaque SMS, car chaque lien annule un seul rendez-vous.

📅 Pour annuler le rendez-vous prévu et choisir une nouvelle date :
https://www.ciel-evasion.fr/mes-billets?ref_annul_meteo=${ref}

👉 Votre espace personnel :
https://www.ciel-evasion.fr/mes-billets

❗ Très important :
Merci de ne faire aucune modification ni annulation auprès de la box (si votre billet a été acheté via une BOX), cela annulerait les avantages exclusifs dont vous bénéficiez en réservant directement avec Ciel-ÉVASION®, prestataire direct.

Je vous souhaite une très belle ${timeWord} et espère vous retrouver très bientôt dans les airs !
Christophe – Pilote chez Ciel-ÉVASION®`;
      };

      // Encodage "light" : seulement retours à la ligne + espaces (pas : / ? = & %)
      function encodeBodyLight(s) {
        return s
          .replace(/\r?\n/g, '%0A')  // newlines
          .replace(/ /g, '%20');     // spaces
      }

      function closeLightbox(delay = 2500) {
        if (!autoCloseEnabled && isIOS) return; // iOS: on n’auto-ferme qu’après clic
        setTimeout(() => window.parent.postMessage({ type: "close" }, "*"), delay);
      }

      function openSms() {
        const body = messageTemplate();
        const smsLink = `sms:${numero}?&body=${encodeBodyLight(body)}`;
        try {
          hiddenSms.setAttribute("href", smsLink);
          hiddenSms.setAttribute("target", "_top");
          hiddenSms.click();
          return;
        } catch (_) {}
        try { window.top.location.href = smsLink; return; } catch (_) {}
        try { window.location.href = smsLink; } catch (_) {}
      }

      function launch() {
        if (launched) return; launched = true;
        try {
          if (isIOS) {
            status.textContent = "📱 Appuyez sur le bouton ci-dessous pour ouvrir Messages :";
            manualBtn.style.display = "inline-block";
            manualBtn.addEventListener("click", () => {
              openSms();
              autoCloseEnabled = true;
              closeLightbox(2500);
            }, { once: true });
          } else {
            openSms();
            closeLightbox(2500);
          }
        } catch (e) {
          status.textContent = "❌ Impossible d’ouvrir Messages sur cet appareil.";
          closeLightbox(2500);
        }
      }

      // Données reçues depuis Wix (nom, ref, numero)
      window.addEventListener("message", (event) => {
        const data = event.data || {};
        if (data.numero) numero = data.numero;
        if (data.nom)    nom    = data.nom;
        if (data.ref)    ref    = data.ref; // ⚠️ passer ici la ref déjà encodée pour l’URL
        setTimeout(launch, 400);
      });

      setTimeout(launch, 1200);
    })();
  </script>
</body>
</html>