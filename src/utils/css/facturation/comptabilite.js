
import PartenairesService from "../../../services/partenaires.js";
import EbilletsService from "../../../services/ebillets.js";

//console.log(await PartenairesService.getAll())
//console.log(await PartenairesService.getByIdEbillet("6650005f-61b4-497f-8cca-2e8b08299fe3"))

export async function facture_comptabilite_css(id_partenaire) {

    //let id_partenaire = "2369c7db-11f5-44b0-a030-9b71a4bb3637"

    let partenaire = await PartenairesService.getByIdEbillet(id_partenaire)

    let all_facture_ebillet = await EbilletsService.getAllEbilletFactureByPartenaire(id_partenaire)

    let sous_total = 0, taxe_total = 0, prix_total = 0

    let Tbody = `<tbody>
    
    ${all_facture_ebillet.map((facture) => {
        let commission = (facture.prix * partenaire.taux_commission) + ((facture.prix * partenaire.taux_commission) * (20 / 100))
        sous_total += commission
        prix_total += facture.prix
        return `
            <tr>
              <td class="cell-elements">${facture.ref} : ${facture.prenom} ${facture.nom}</td>
              <td class="cell-quantity">1</td>
              <td class="cell-price">${facture.prix}</td>
              <td class="cell-taxes">20%</td>
              <td class="cell-commission">${commission}</td>
            </tr>
          `
    }).join('')}
    </tbody>`

    taxe_total = sous_total * (20 / 100)
    let total = sous_total + taxe_total

    let reversion_par_virement = prix_total - total

    return {
        html: `
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${partenaire.title}</title>
  <style>
    /* ==========================================================================
       RESET & SYSTEM DEFAULTS
       ========================================================================== */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f3f4f6;
      /* Screen-only background to simulate paper preview */
      color: #1f2937;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      padding: 40px 20px;
    }

    /* ==========================================================================
       A4 PAGE LAYOUT (A4 Proportions)
       ========================================================================== */
    .invoice-container {
      background-color: #ffffff;
      width: 100%;
      max-width: 800px;
      /* Aligns with A4 aspect ratio when scaled */
      min-height: 1050px;
      margin: 0 auto;
      padding: 60px 50px 50px 50px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* ==========================================================================
       HEADER SECTION
       ========================================================================== */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 35px;
    }

    .logo-container {
      display: block;
      width: 160px;
      height: 38px;
      overflow: hidden;
    }

    .logo {
      width: 160px;
      height: auto;
      margin-top: -34.6%;
      display: block;
    }

    .meta-container {
      text-align: right;
      margin-top: 4px;
    }

    .invoice-title {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }

    .invoice-number {
      font-weight: 500;
    }

    .invoice-date {
      font-size: 11.5px;
      color: #4b5563;
    }

    /* ==========================================================================
       COMPANY INFO SECTION
       ========================================================================== */
    .company-section {
      margin-bottom: 30px;
      text-align: left;
    }

    .company-name {
      font-size: 14.5px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 5px;
    }

    .company-details p {
      font-size: 11.5px;
      color: #374151;
      margin-bottom: 3px;
    }

    /* ==========================================================================
       CLIENT INFO SECTION
       ========================================================================== */
    .client-section {
      margin-bottom: 35px;
      text-align: left;
    }

    .section-title {
      font-size: 14.5px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 12px;
    }

    .client-details {
      font-size: 11.5px;
      color: #374151;
      line-height: 1.45;
    }

    .client-name {
      font-weight: 700;
      color: #111827;
      margin-bottom: 3px;
    }

    .client-details p {
      margin-bottom: 3px;
    }

    /* ==========================================================================
       ELEMENTS TABLE
       ========================================================================== */
    .table-section {
      margin-bottom: 25px;
    }

    .elements-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .elements-table th {
      font-size: 13.5px;
      font-weight: 700;
      color: #111827;
      padding: 10px 8px;
      border-bottom: 2px solid #1f2937;
    }

    .elements-table td {
      font-size: 11.5px;
      color: #1f2937;
      padding: 11px 8px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: middle;
    }

    /* Column Widths & Alignments */
    .col-elements,
    .cell-elements {
      width: 48%;
      text-align: left;
    }

    .col-quantity,
    .cell-quantity {
      width: 12%;
      text-align: center;
    }

    .col-price,
    .cell-price {
      width: 14%;
      text-align: right;
    }

    .col-taxes,
    .cell-taxes {
      width: 12%;
      text-align: center;
      color: #4b5563;
    }

    .col-commission,
    .cell-commission {
      width: 14%;
      text-align: right;
      border-right: 1px solid #d1d5db;
      /* Thin vertical border on the right edge of table */
    }

    .elements-table th.col-commission {
      border-right: 1px solid #1f2937;
    }

    /* ==========================================================================
       TOTALS BLOCK
       ========================================================================== */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 45px;
    }

    .totals-block {
      width: 280px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      padding: 4px 0;
      color: #374151;
    }

    .totals-row.bold {
      font-weight: 700;
      color: #111827;
    }

    .totals-row.text-grey {
      color: #4b5563;
    }

    .border-top-total {
      border-top: 1px solid #d1d5db;
      margin-top: 4px;
      padding-top: 8px;
    }

    .total-row {
      font-size: 14px;
    }

    .total-row .value {
      font-size: 15px;
      font-weight: 700;
    }

    /* ==========================================================================
       PAYMENT SECTION
       ========================================================================== */
    .payment-section {
      margin-bottom: auto;
      /* Pushes the footer down if container height permits */
      padding-bottom: 40px;
    }

    .payment-details-box {
      display: flex;
      border: 1px solid #d1d5db;
      border-radius: 2px;
      background-color: #ffffff;
      align-items: center;
    }

    .payment-col {
      padding: 12px 16px;
      font-size: 11px;
      color: #1f2937;
    }

    .col-date {
      width: 110px;
      color: #4b5563;
    }

    .col-method {
      flex-grow: 1;
      border-left: 1px solid #d1d5db;
      border-right: 1px solid #d1d5db;
    }

    .col-amount {
      width: 130px;
      font-weight: 700;
      text-align: left;
    }

    /* ==========================================================================
       FOOTER SECTION
       ========================================================================== */
    .invoice-footer {
      border-top: 1px solid #d1d5db;
      padding-top: 15px;
      margin-top: 40px;
      text-align: left;
    }

    .footer-thanks {
      font-size: 12.5px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }

    .footer-cgv {
      font-size: 9.5px;
      color: #6b7280;
      line-height: 1.4;
    }

    /* ==========================================================================
       PRINT OPTIMIZATIONS
       ========================================================================== */
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }

      .invoice-container {
        box-shadow: none;
        max-width: 100%;
        width: 100%;
        padding: 10mm 10mm;
        margin: 0;
        min-height: auto;
      }

      .payment-details-box {
        background-color: transparent !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    /* ==========================================================================
       RESPONSIVE OPTIMIZATIONS
       ========================================================================== */
    @media screen and (max-width: 600px) {
      body {
        padding: 10px 5px;
      }

      .invoice-container {
        padding: 30px 15px;
      }

      .invoice-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .meta-container {
        text-align: left;
      }

      .elements-table th,
      .elements-table td {
        padding: 8px 4px;
        font-size: 10.5px;
      }

      .payment-details-box {
        flex-direction: column;
        align-items: stretch;
      }

      .col-method {
        border-left: none;
        border-right: none;
        border-top: 1px solid #d1d5db;
        border-bottom: 1px solid #d1d5db;
      }

      .col-date,
      .col-amount {
        width: 100%;
      }
    }
  </style>
</head>

<body>
  <div class="invoice-container">
    <!-- Header -->
    <header class="invoice-header">
      <div class="logo-container">
        <!-- Brand logo using the specified Wix image URL -->
        <img src="https://static.wixstatic.com/media/5192e0_e7e2430dd874429d93e0527b58faa1c8~mv2.png"
          alt="Ciel-ÉVASION®" class="logo">
      </div>
      <div class="meta-container">
        <h1 class="invoice-title">Facture n° <span class="invoice-number">00001493</span> ${partenaire.prenomPartenaire} ${partenaire.nom} </h1>
        <p class="invoice-date">Date d'émission : ${new Date().toISOString().split('T')[0]}</p>
      </div>
    </header>

    <!-- Company Info -->
    <section class="company-section">
      <h2 class="company-name">Ciel-ÉVASION® Activités Aériennes</h2>
      <div class="company-details">
        <p>contact@ciel-evasion.fr</p>
        <p>SIREN : 819 022 849</p>
        <p>Site internet : www.ciel-evasion.fr</p>
        <p>N°TVA Intracommunautaire : FR68819022849</p>
        <p>IBAN : FR76 3000 4013 7200 0101 6000 445</p>
      </div>
    </section>

    <!-- Client Info -->
    <section class="client-section">
      <h2 class="section-title">Détails du client</h2>
      <div class="client-details">
        <p class="client-name">${partenaire.title}</p>
        <p>${partenaire.adresse}</p>
        <p>${partenaire.ville}</p>
        <p>${partenaire.pays}</p>
        <p>${partenaire.email}</p>
        <p>Téléphone : ${partenaire.tel}</p>
      </div>
    </section>

    <!-- Table Section -->
    <section class="table-section">
      <table class="elements-table">
        <thead>
          <tr>
            <th class="col-elements">Éléments</th>
            <th class="col-quantity">Quantité</th>
            <th class="col-price">Prix</th>
            <th class="col-taxes">Taxes</th>
            <th class="col-commission">Commission</th>
          </tr>
        </thead>
        
        ${Tbody}

      </table>
    </section>

    <!-- Totals Section -->
    <section class="totals-section">
      <div class="totals-block">
        <div class="totals-row bold">
          <span class="label">Sous-total</span>
          <span class="value">${sous_total.toFixed(2).replace('.', ',')} €</span>
        </div>
        <div class="totals-row text-grey">
          <span class="label">Taxes</span>
          <span class="value">${taxe_total.toFixed(2).replace('.', ',')} €</span>
        </div>
        <div class="totals-row text-grey">
          <span class="label">Frais de livraison</span>
          <span class="value">0,00 €</span>
        </div>
        <div class="totals-row bold border-top-total total-row">
          <span class="label">Total</span>
          <span class="value">${total.toFixed(2).replace('.', ',')} €</span>
        </div>
      </div>
    </section>

    <!-- Payment Section -->
    <section class="payment-section">
      <h2 class="section-title">Détail du paiement</h2>
      <div class="payment-details-box">
        <div class="payment-col col-date">${new Date().toISOString().split('T')[0]}</div>
        <div class="payment-col col-method">Réversion par virement</div>
        <div class="payment-col col-amount">${reversion_par_virement.toFixed(2).replace('.', ',')} €</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="invoice-footer">
      <p class="footer-thanks">Ciel-ÉVASION® vous remercie de votre confiance</p>
      <p class="footer-cgv">Vous reconnaissez avoir pris connaissance des Conditions Générales de Vente de la société
        Ciel-ÉVASION®</p>
    </footer>
  </div>
</body>

</html>`
    }
}