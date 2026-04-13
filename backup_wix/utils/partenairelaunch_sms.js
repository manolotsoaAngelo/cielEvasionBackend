
$w.onReady(() => {
    console.log("Page is ready");

    const menuIcon = $w("#menuIcon");
    const contactButton = $w("#contact");
    let isPopupOpen = false;
    let isContactPopupOpen = false;

    menuIcon.onClick(() => {
        if (!isPopupOpen) {
            console.log("Ouverture de la Lightbox pour le menu");

            menuIcon.src = "https://static.wixstatic.com/media/5192e0_57c86f6707974178a298aed84188edb1~mv2.png";

            wixWindow.openLightbox("PopupMenuPartenaire").then(() => {
                console.log("Lightbox fermée");

                menuIcon.src = "https://static.wixstatic.com/media/5192e0_41600e96268b410897c950d1fcd579c1~mv2.png";
                isPopupOpen = false;
            });

            isPopupOpen = true;
        }
    });

    contactButton.onClick(() => {
        if (!isContactPopupOpen) {
            console.log("Ouverture de la Lightbox pour Contact");

            wixWindow.openLightbox("PopupContactPartenaire").then(() => {
                console.log("Lightbox de Contact fermée");
                isContactPopupOpen = false;
            });

            isContactPopupOpen = true;
        } else {
            console.log("Fermeture de la Lightbox pour Contact");
            wixWindow.lightbox.close()
            isContactPopupOpen = false;
        }
    });
});

// 🟩 Gestion du bouton SMS dans les réservations confirmées
function normalizePhoneFR(raw) {
    if (!raw) return "";
    let s = String(raw).replace(/[^\d+]/g, ""); // garde seulement les chiffres et le +
    if (s.startsWith("0")) s = "+33" + s.slice(1); // remplace 0 initial par +33
    if (!s.startsWith("+") && s.length === 10) s = "+33" + s.slice(1);
    return s;
}

$w('#repetReserve').onItemReady(($item, itemData) => {
    $item('#btnSms').onClick(() => {
        const nomBenef = $item('#ReservprenomNOM').text || "Client";
        const refBillet = ($item('#refReserve').text || "").replace("Ref : ", "") || "inconnu";

        // ✅ On utilise UNIQUEMENT le champ CMS “Tel Point Météo”
        const numero = normalizePhoneFR(itemData.lieu111);

        if (!numero) {
            wixWindow.openLightbox("Info", { message: "Numéro (Tel Point Météo) manquant dans la base." });
            return;
        }

        wixWindow.openLightbox("openSMS", { nom: nomBenef, ref: refBillet, numero });
    });
});