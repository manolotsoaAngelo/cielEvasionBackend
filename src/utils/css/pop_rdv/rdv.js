import EbilletsService from "../../../services/ebillets.js";

export async function pop_rdv_css() {

  let all_ebillet = await EbilletsService.getAll()

  return {
    html: `
        <!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réservation & Disponibilités</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1890ff;
      --primary-hover: #096dd9;
      --primary-light: #e6f7ff;
      --text-dark: #1d1d1f;
      --text-muted: #86868b;
      --border-color: #d9d9d9;
      --border-focus: #40a9ff;
      --bg-page: #f2f4f8;
      --card-bg: #ffffff;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      --radius-lg: 24px;
      --radius-md: 10px;
      --transition: all 0.25s ease;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    body {
      background: transparent !important;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }

    .modal-card {
      background: var(--card-bg);
      width: 100%;
      max-width: 650px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow);
      padding: 40px 44px;
      position: relative;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .brand-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eaeaea;
    }

    .brand-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo-img {
      height: 95px;
      width: auto;
      max-width: 280px;
      object-fit: contain;
    }

    .brand-divider {
      width: 1.5px;
      height: 54px;
      background: #e0e0e5;
    }

    .brand-name {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-dark);
      letter-spacing: -0.4px;
    }

    .step-header {
      margin-bottom: 28px;
    }

    .step-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }

    .step-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .stepper-nav {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
      position: relative;
    }

    .step-tab {
      flex: 1;
      text-align: left;
      padding-bottom: 10px;
      font-size: 12.5px;
      font-weight: 600;
      color: #a0a0a6;
      border-bottom: 3px solid #e5e5ea;
      cursor: pointer;
      transition: var(--transition);
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .step-tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .step-tab.completed {
      color: var(--text-dark);
      border-bottom-color: #34c759;
    }

    .step-content {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .step-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .field-group {
      margin-bottom: 20px;
      position: relative;
    }

    .field-label {
      font-size: 13.5px;
      font-weight: 600;
      color: #4a4a4a;
      margin-bottom: 8px;
      display: block;
    }

    .input-outline-wrapper {
      position: relative;
    }

    .input-control {
      width: 100%;
      height: 48px;
      border: 1.5px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0 16px;
      font-size: 14.5px;
      color: var(--text-dark);
      background: #fff;
      outline: none;
      transition: var(--transition);
    }

    .input-control:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.12);
    }

    select.input-control {
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%3C86868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 40px;
    }

    .dispo-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 18px;
      padding: 16px;
      background: #f9fafc;
      border: 1px solid #ebedf0;
      border-radius: 12px;
    }

    .dispo-row-title {
      grid-column: 1 / -1;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .location-box {
      background: #f4f5f7;
      border-radius: 8px;
      padding: 24px;
      margin-top: 10px;
    }

    .location-title {
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 18px;
    }

    .location-options {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .location-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      font-size: 14.5px;
      color: #2c3e50;
      line-height: 1.4;
      padding: 4px 0;
    }

    .location-option input[type="radio"] {
      margin-top: 2px;
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .infos-phone-box {
      background: #f4f5f7;
      padding: 20px 24px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .mes-infos-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .mes-infos-title {
      font-size: 17px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .mes-infos-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 20px;
      padding: 2px 14px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
    }

    .mes-infos-box {
      background: #f4f5f7;
      padding: 24px;
      border-radius: 8px;
    }

    .radio-card-group {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .radio-card {
      position: relative;
      border: 2px solid var(--border-color);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      cursor: pointer;
      transition: var(--transition);
      background: #fff;
    }

    .radio-card:hover {
      border-color: #a0cfff;
      background: #fbfdff;
    }

    .radio-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }

    .radio-card input[type="radio"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .radio-content {
      flex: 1;
    }

    .radio-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .radio-price {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary);
      background: #ffffff;
      padding: 2px 10px;
      border-radius: 20px;
      border: 1px solid #bae7ff;
    }

    .radio-desc {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .badge-recommended {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #fff;
      background: #52c41a;
      padding: 2px 8px;
      border-radius: 6px;
      margin-left: 8px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 14px;
      margin-top: 36px;
    }

    .btn {
      height: 48px;
      padding: 0 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
    }

    .btn-secondary {
      background: #ffffff;
      color: var(--text-dark);
      border: 1.5px solid var(--border-color);
    }

    .btn-secondary:hover {
      background: #f5f5f7;
      border-color: #c7c7cc;
    }

    .btn-primary {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }

    .success-box {
      text-align: center;
      padding: 30px 10px;
    }

    .success-icon {
      width: 72px;
      height: 72px;
      background: #e6f7ff;
      color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .success-icon svg {
      width: 36px;
      height: 36px;
    }

    .recap-list {
      background: #f9fbfd;
      border: 1px solid #e1e8ed;
      border-radius: 12px;
      padding: 20px;
      text-align: left;
      margin: 24px 0;
      font-size: 14px;
    }

    .recap-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #e8e8e8;
    }

    .recap-item:last-child {
      border-bottom: none;
    }

    .recap-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .recap-val {
      color: var(--text-dark);
      font-weight: 600;
      text-align: right;
      max-width: 60%;
    }

    @media (max-width: 600px) {
      .modal-card {
        padding: 28px 20px;
      }

      .brand-header {
        margin-bottom: 20px;
        padding-bottom: 12px;
      }

      .brand-left {
        gap: 10px;
      }

      .brand-logo-img {
        height: 65px;
        max-width: 200px;
      }

      .brand-divider {
        height: 40px;
      }

      .brand-name {
        font-size: 18px;
      }

      .dispo-row {
        grid-template-columns: 1fr;
      }

      .stepper-nav {
        gap: 4px;
      }

      .step-tab {
        font-size: 11px;
        padding-bottom: 6px;
      }
    }

    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    .popup-box {
      background: #ffffff;
      border-radius: 20px;
      padding: 30px 26px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      animation: popUpScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popUpScale {
      from {
        opacity: 0;
        transform: scale(0.92);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .popup-icon-wrapper {
      width: 54px;
      height: 54px;
      background: #fffbe6;
      color: #faad14;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      border: 1px solid #ffe58f;
    }

    .popup-icon {
      width: 26px;
      height: 26px;
    }

    .popup-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 8px;
    }

    .popup-message {
      font-size: 14px;
      color: #555;
      line-height: 1.55;
      white-space: pre-line;
      margin-bottom: 24px;
    }

    .popup-btn {
      width: 100%;
      height: 44px;
      border-radius: 10px;
      font-size: 14.5px;
    }
  </style>
</head>

<body>
  <div class="modal-card">
    <div class="brand-header">
      <div class="brand-left">
        <img src="https://static.wixstatic.com/media/5192e0_e7e2430dd874429d93e0527b58faa1c8~mv2.png" alt="Ciel Évasion"
          class="brand-logo-img">
        <div class="brand-divider"></div>
        <h1 class="brand-name">Prendre rendez-vous</h1>
      </div>
    </div>
    <div class="stepper-nav">
      <div class="step-tab active" id="tab-1" onclick="goToStep(1)">1. Réservation</div>
      <div class="step-tab" id="tab-2" onclick="goToStep(2)">2. Disponibilités</div>
      <div class="step-tab" id="tab-3" onclick="goToStep(3)">3. Lieu</div>
      <div class="step-tab" id="tab-4" onclick="goToStep(4)">4. Souscription</div>
      <div class="step-tab" id="tab-5" onclick="goToStep(5)">5. Mes infos</div>
    </div>
    <form id="multi-step-form" onsubmit="handleFormSubmit(event)">
      <div class="step-content active" id="step-1">
        <div class="step-header">
          <h2 class="step-title">Vérifier et compléter votre réservation</h2>
          <p class="step-subtitle">Veuillez renseigner les données figurant sur votre billet</p>
        </div>
        <div class="field-group">
          <label class="field-label" for="ref-ebillet">Référence e-billet</label>
          <div class="input-outline-wrapper">
            <input type="text" id="ref-ebillet" class="input-control" placeholder="ex: EXXXXXX-1" required>
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="nom-prenom">Nom et Prénom</label>
          <div class="input-outline-wrapper">
            <input type="text" id="nom-prenom" class="input-control" placeholder="ex: Thomas Dupont" required>
          </div>
        </div>
      </div>
      <div class="step-content" id="step-2">
        <div class="step-header">
          <h2 class="step-title">Choisissez vos disponibilités</h2>
          <p class="step-subtitle">Sélectionnez 3 choix de dates avec leur créneau horaire préféré</p>
        </div>
        <div class="dispo-row">
          <div class="dispo-row-title">Option 1</div>
          <div>
            <label class="field-label">Sélectionnez une date</label>
            <input type="date" id="date-1" class="input-control" required>
          </div>
          <div>
            <label class="field-label">Sélectionnez une horaire</label>
            <select id="horaire-1" class="input-control" required>
              <option value="" disabled selected>Choisir l'horaire</option>
              <option value="Sans préférence d'horaire">Sans préférence d'horaire</option>
              <option value="Matin">Matin</option>
              <option value="Midi">Après-midi (sauf montgolfière)</option>
              <option value="Soir">Soir</option>
            </select>
          </div>
        </div>
        <div class="dispo-row">
          <div class="dispo-row-title">Option 2</div>
          <div>
            <label class="field-label">Sélectionnez une date</label>
            <input type="date" id="date-2" class="input-control" required>
          </div>
          <div>
            <label class="field-label">Sélectionnez une horaire</label>
            <select id="horaire-2" class="input-control" required>
              <option value="" disabled selected>Choisir l'horaire</option>
              <option value="Sans préférence d'horaire">Sans préférence d'horaire</option>
              <option value="Matin">Matin</option>
              <option value="Midi">Après-midi (sauf montgolfière)</option>
              <option value="Soir">Soir</option>
            </select>
          </div>
        </div>
        <div class="dispo-row">
          <div class="dispo-row-title">Option 3</div>
          <div>
            <label class="field-label">Sélectionnez une date</label>
            <input type="date" id="date-3" class="input-control" required>
          </div>
          <div>
            <label class="field-label">Sélectionnez une horaire</label>
            <select id="horaire-3" class="input-control" required>
              <option value="" disabled selected>Choisir l'horaire</option>
              <option value="Sans préférence d'horaire">Sans préférence d'horaire</option>
              <option value="Matin">Matin</option>
              <option value="Midi">Après-midi (sauf montgolfière)</option>
              <option value="Soir">Soir</option>
            </select>
          </div>
        </div>
      </div>
      <div class="step-content" id="step-3">
        <div class="location-box">
          <h3 class="location-title">Lieu de préférence pour mon activité *</h3>
          <div class="location-options">
            <label class="location-option">
              <input type="radio" name="lieu_preference" value="Herqueville (27430)" required>
              <span>Herqueville (27430)</span>
            </label>
            <label class="location-option">
              <input type="radio" name="lieu_preference" value="Le Héron (76780)">
              <span>Le Héron (76780)</span>
            </label>
            <label class="location-option">
              <input type="radio" name="lieu_preference"
                value="Le Héron ou Herqueville en fonction de la meilleur direction des vents">
              <span>Le Héron ou Herqueville en fonction de la meilleur direction des vents</span>
            </label>
            <label class="location-option">
              <input type="radio" name="lieu_preference"
                value="Beauval-en-Caux (76890) « uniquement les 19, 20 et 21 juin 2026 »">
              <span>Beauval-en-Caux (76890) « uniquement les 19, 20 et 21 juin 2026 »</span>
            </label>
          </div>
        </div>
      </div>
      <div class="step-content" id="step-4">
        <div class="step-header">
          <h2 class="step-title">Protégez-vous contre les imprévus</h2>
          <p class="step-subtitle">Assurez votre réservation en cas de retard, maladie ou annulation</p>
        </div>
        <div class="radio-card-group">
          <label class="radio-card" id="card-garantie-yes" onclick="selectGarantie(true)">
            <input type="radio" name="garantie" id="garantie-oui" value="oui">
            <div class="radio-content">
              <div class="radio-title">
                <span>
                  Souscrire à la Garantie Échanges et Report
                  <span class="badge-recommended">Recommandé</span>
                </span>
              </div>
              <div class="radio-desc">
                Remboursement à 100% de votre réservation sans justificatif complexe jusqu'à 2h avant le RDV.
              </div>
            </div>
          </label>
          <label class="radio-card" id="card-garantie-no" onclick="selectGarantie(false)">
            <input type="radio" name="garantie" id="garantie-non" value="non">
            <div class="radio-content">
              <div class="radio-title">
                <span>Non merci, je ne souhaite pas Souscrire</span>
              </div>
              <div class="radio-desc">
                En cas d'annulation ou d'absence, aucun remboursement ni report sans frais ne sera accordé.
              </div>
            </div>
          </label>
        </div>
      </div>
      <div class="step-content" id="step-5">
        <div class="mes-infos-box">
          <div class="field-group">
            <label class="field-label" for="telephone">N° de téléphone (pour le point météo) *</label>
            <div class="input-outline-wrapper">
              <input type="tel" id="telephone" class="input-control" required>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="prenom">Prénom *</label>
            <div class="input-outline-wrapper">
              <input type="text" id="prenom" class="input-control" required>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="nom">Nom *</label>
            <div class="input-outline-wrapper">
              <input type="text" id="nom" class="input-control" required>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" id="label-date-naissance" for="date_de_naissance">Date de naissance *</label>
            <div class="input-outline-wrapper">
              <input type="date" id="date_de_naissance" class="input-control" required>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="poids">Poids ( kg ) *</label>
            <div class="input-outline-wrapper">
              <input type="number" id="poids" class="input-control" required>
            </div>
          </div>
          <div class="field-group" style="margin-bottom: 0;">
            <label class="field-label" for="taille">Taille ( cm ) *</label>
            <div class="input-outline-wrapper">
              <input type="number" id="taille" class="input-control" required>
            </div>
          </div>
        </div>
      </div>
      <div class="step-content" id="step-success">
        <div class="success-box">
          <div class="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="step-title">Réservation confirmée !</h2>
          <p class="step-subtitle">Votre demande a été traitée avec succès.</p>
          <div class="recap-list" id="recap-content">
          </div>
          <button type="button" class="btn btn-primary" style="width: 100%;" onclick="resetForm()">Effectuer une autre
            démarche</button>
        </div>
      </div>
      <div class="modal-footer" id="modal-footer">
        <button type="button" class="btn btn-secondary" id="btn-back" onclick="prevStep()">Annuler</button>
        <button type="button" class="btn btn-primary" id="btn-next" onclick="nextStep()">Suivant</button>
      </div>
    </form>
  </div>

  <div id="custom-popup" class="popup-overlay" style="display: none;" onclick="closePopupOnBackdrop(event)">
    <div class="popup-box">
      <div class="popup-icon-wrapper">
        <svg class="popup-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 id="popup-title" class="popup-title">Information</h3>
      <div id="popup-message" class="popup-message"></div>
      <button type="button" class="btn btn-primary popup-btn" onclick="closePopup()">D'accord</button>
    </div>
  </div>
  <script>
    let all_ebillet = ${JSON.stringify(all_ebillet)};
    let ebillet;

    let currentStep = 1;
    const totalSteps = 5;
    function updateStepUI() {
      const tab4 = document.getElementById('tab-4');
      if (tab4) {
        if (ebillet && ebillet.souscription === true) {
          tab4.style.display = 'none';
        } else {
          tab4.style.display = 'block';
        }
      }
      for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(\`step-\${i}\`).classList.remove('active');
        const tab = document.getElementById(\`tab-\${i}\`);
        if (tab) {
          tab.classList.remove('active', 'completed');
          if (i < currentStep) {
            tab.classList.add('completed');
          } else if (i === currentStep) {
            tab.classList.add('active');
          }
        }
      }
      document.getElementById(\`step-\${currentStep}\`).classList.add('active');
      const btnBack = document.getElementById('btn-back');
      const btnNext = document.getElementById('btn-next');

      if (currentStep === 1) {
        btnBack.innerText = "Annuler";
      } else {
        btnBack.innerText = "Précédent";
      }

      if (currentStep === totalSteps) {
        btnNext.innerText = "Continuer";
      } else if (currentStep === 4 && isSouscriptionLoading) {
        btnNext.innerText = "Patientez...";
        btnNext.disabled = true;
        btnNext.style.opacity = '0.6';
        btnNext.style.cursor = 'not-allowed';
      } else {
        btnNext.innerText = "Suivant";
        btnNext.disabled = false;
        btnNext.style.opacity = '1';
        btnNext.style.cursor = 'pointer';
      }
    }
    function validateCurrentStep() {
      const activeStepEl = document.getElementById(\`step-\${currentStep}\`);
      const inputs = activeStepEl.querySelectorAll('input[required], select[required]');
      for (let input of inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          return false;
        }
      }
      if (currentStep === 1) {
        const refInput = document.getElementById('ref-ebillet');
        const nameInput = document.getElementById('nom-prenom');
        const refValue = refInput ? refInput.value.trim() : '';
        const nameValue = nameInput ? nameInput.value.trim().toLowerCase() : '';
        ebillet = all_ebillet.find((item) => (item.ref).toLowerCase() === refValue.toLowerCase());
        if (!ebillet) {
          showPopup("Aucun e-billet trouvé avec la référence saisie.", "e-Billet introuvable");
          return false;
        }
        const isRefValid = refValue.toLowerCase() === ebillet.ref.toLowerCase();
        const nomLower = ebillet.nom.toLowerCase();
        const prenomLower = ebillet.prenom.toLowerCase();
        const isNameValid = nameValue.includes(nomLower) || nameValue.includes(prenomLower);
        if (!isRefValid || !isNameValid) {
          let errorMsg = "Vérification de l'e-billet :\n\n";
          if (!isRefValid && !isNameValid) {
            errorMsg += "• La référence e-billet et le Nom/Prénom ne correspondent à aucun billet actif.";
          } else if (!isRefValid) {
            errorMsg += "• La référence e-billet saisie est incorrecte.";
          } else {
            errorMsg += "• Le Nom ou Prénom ne correspond pas au e-billet.";
          }
          showPopup(errorMsg, "Erreur de validation");
          return false;
        }
        const telEl = document.getElementById('telephone');
        const prenomEl = document.getElementById('prenom');
        const nomEl = document.getElementById('nom');
        const dobEl = document.getElementById('date_de_naissance');
        const poidsEl = document.getElementById('poids');
        const tailleEl = document.getElementById('taille');
        if (telEl && !telEl.value) telEl.value = ebillet.lieu111 || '';
        if (prenomEl && !prenomEl.value) prenomEl.value = ebillet.prenom || '';
        if (nomEl && !nomEl.value) nomEl.value = ebillet.nom || '';
        if (dobEl && !dobEl.value) {
          dobEl.value = ebillet.date_de_naissance || '';
          if (typeof updateAgeLabel === 'function') updateAgeLabel();
        }
        if (poidsEl && !poidsEl.value) poidsEl.value = ebillet.poids || '';
        if (tailleEl && !tailleEl.value) tailleEl.value = ebillet.taille || '';
      }
      if (currentStep === 2) {
        const d1 = document.getElementById('date-1').value;
        const d2 = document.getElementById('date-2').value;
        const d3 = document.getElementById('date-3').value;
        if (d1 && d2 && d1 === d2) {
          showPopup("Les dates des options de disponibilité doivent toutes être différentes.", "Date en doublon");
          return false;
        }
        if (d1 && d3 && d1 === d3) {
          showPopup("Les dates des options de disponibilité doivent toutes être différentes.", "Date en doublon");
          return false;
        }
        if (d2 && d3 && d2 === d3) {
          showPopup("Les dates des options de disponibilité doivent toutes être différentes.", "Date en doublon");
          return false;
        }
      }

      if (currentStep === 4) {
        const radioYes = document.getElementById('garantie-oui');
        const radioNo = document.getElementById('garantie-non');

        if (!radioYes.checked && !radioNo.checked) {
          showPopup("Veuillez choisir une option (souscrire à la garantie ou ne pas souscrire) avant de continuer.", "Sélection requise");
          return false;
        }

        if (isSouscriptionLoading) {
          return false;
        }
      }

      return true;
    }
    function nextStep() {
      if (!validateCurrentStep()) return;
      if (currentStep < totalSteps) {
        currentStep++;
        if (currentStep === 4 && ebillet && ebillet.souscription === true) {
          currentStep = 5;
        }
        updateStepUI();
      } else {
        submitForm();
      }
    }
    function prevStep() {
      if (souscriptionTimer) {
        clearTimeout(souscriptionTimer);
        souscriptionTimer = null;
      }
      isSouscriptionLoading = false;

      if (currentStep > 1) {
        currentStep--;
        if (currentStep === 4 && ebillet && ebillet.souscription === true) {
          currentStep = 3;
        }
        updateStepUI();
      } else {
        showPopup("Action d'annulation déclenchée.", "Annulation");
      }
    }
    function goToStep(step) {
      if (step === 4 && ebillet && ebillet.souscription === true) {
        return;
      }
      if (step < currentStep) {
        currentStep = step;
        updateStepUI();
      } else if (step > currentStep) {
        if (validateCurrentStep()) {
          currentStep = step;
          updateStepUI();
        }
      }
    }
    function sendReturnMessage(msg) {
      window.parent.postMessage(msg, "https://www.ciel-evasion.fr/");
    }

    let souscriptionTimer = null;
    let isSouscriptionLoading = false;

    function selectGarantie(isYes) {
      const cardYes = document.getElementById('card-garantie-yes');
      const cardNo = document.getElementById('card-garantie-no');
      const radioYes = document.getElementById('garantie-oui');
      const radioNo = document.getElementById('garantie-non');
      const btnNext = document.getElementById('btn-next');

      if (souscriptionTimer) {
        clearTimeout(souscriptionTimer);
        souscriptionTimer = null;
      }

      if (isYes) {
        cardYes.classList.add('selected');
        cardNo.classList.remove('selected');
        radioYes.checked = true;

        sendReturnMessage({ type_msg: "souscription", data: ebillet });

        isSouscriptionLoading = true;
        if (btnNext) {
          btnNext.disabled = true;
          btnNext.style.opacity = '0.6';
          btnNext.style.cursor = 'not-allowed';
          btnNext.innerText = 'Patientez...';
        }

        souscriptionTimer = setTimeout(() => {
          isSouscriptionLoading = false;
          if (cardNo) {
            cardNo.style.display = 'none';
          }
          if (btnNext) {
            btnNext.disabled = false;
            btnNext.style.opacity = '1';
            btnNext.style.cursor = 'pointer';
            btnNext.innerText = 'Suivant';
          }
        }, 3000);

      } else {
        cardNo.classList.add('selected');
        cardYes.classList.remove('selected');
        radioNo.checked = true;

        isSouscriptionLoading = false;
        if (btnNext) {
          btnNext.disabled = false;
          btnNext.style.opacity = '1';
          btnNext.style.cursor = 'pointer';
          btnNext.innerText = 'Suivant';
        }
      }
    }
    function submitForm() {
      const refEbillet = document.getElementById('ref-ebillet').value;
      const nomPrenom = document.getElementById('nom-prenom').value;
      const d1 = document.getElementById('date-1').value;
      const h1 = document.getElementById('horaire-1').value;
      const d2 = document.getElementById('date-2').value;
      const h2 = document.getElementById('horaire-2').value;
      const d3 = document.getElementById('date-3').value;
      const h3 = document.getElementById('horaire-3').value;
      const lieuSelected = document.querySelector('input[name="lieu_preference"]:checked')?.value || "Non spécifié";
      const garantieOui = (ebillet && ebillet.souscription === true) ? true : document.getElementById('garantie-oui').checked;
      const tel = document.getElementById('telephone').value;
      const prenom = document.getElementById('prenom').value;
      const nom = document.getElementById('nom').value;
      const dateNaissanceVal = document.getElementById('date_de_naissance').value;
      const calculatedAge = calculateAge(dateNaissanceVal);
      const ageDisplay = calculatedAge !== null ? \`\${calculatedAge} ans\` : dateNaissanceVal;
      const poids = document.getElementById('poids').value;
      const taille = document.getElementById('taille').value;
      document.querySelector('.stepper-nav').style.display = 'none';
      document.getElementById('modal-footer').style.display = 'none';
      for (let i = 1; i <= totalSteps; i++) {
        document.getElementById(\`step-\${i}\`).classList.remove('active');
      }
      const recapHTML = \`
        <div class="recap-item">
          <span class="recap-label">Réf. E-billet :</span>
          <span class="recap-val">\${refEbillet}</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Nom & Prénom :</span>
          <span class="recap-val">\${prenom} \${nom}</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Disponibilité 1 :</span>
          <span class="recap-val">\${d1} (\${h1})</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Disponibilité 2 :</span>
          <span class="recap-val">\${d2} (\${h2})</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Disponibilité 3 :</span>
          <span class="recap-val">\${d3} (\${h3})</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Lieu de préférence :</span>
          <span class="recap-val">\${lieuSelected}</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Garantie Imprévus :</span>
          <span class="recap-val" style="color: \${garantieOui ? '#52c41a' : '#ff4d4f'};">
            \${garantieOui ? 'Souscrite ' : 'Non souscrite'}
          </span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Téléphone (Météo) :</span>
          <span class="recap-val">\${tel}</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Participant :</span>
          <span class="recap-val">\${prenom} \${nom} (\${ageDisplay})</span>
        </div>
        <div class="recap-item">
          <span class="recap-label">Poids / Taille :</span>
          <span class="recap-val">\${poids} kg / \${taille} cm</span>
        </div>
      \`;
      document.getElementById('recap-content').innerHTML = recapHTML;
      document.getElementById('step-success').classList.add('active');

      let resultat = ebillet;

      resultat._id = ebillet._id;
      resultat.ref = refEbillet;
      resultat.rdvDemand1 = d1;
      resultat.choixHoraireDate1 = h1;
      resultat.rdvDemand11 = d2;
      resultat.choixHoraireDate2 = h2;
      resultat.rdvDemand111 = d3;
      resultat.choixHoraireDate3 = h3;
      resultat.lieu = lieuSelected;
      resultat.souscription = garantieOui;
      resultat.lieu111 = tel;
      resultat.date_de_naissance = dateNaissanceVal;
      resultat.poids = Number(poids);
      resultat.taille = Number(taille);
      resultat.nb_rdv = Number(1);

      console.log(resultat);
      sendReturnMessage({ type_msg: "save_rdv", data: resultat });
    }
    function resetForm() {
      document.getElementById('multi-step-form').reset();
      if (souscriptionTimer) {
        clearTimeout(souscriptionTimer);
        souscriptionTimer = null;
      }
      isSouscriptionLoading = false;

      const cardYes = document.getElementById('card-garantie-yes');
      const cardNo = document.getElementById('card-garantie-no');
      if (cardYes) cardYes.classList.remove('selected');
      if (cardNo) {
        cardNo.classList.remove('selected');
        cardNo.style.display = 'flex';
      }

      currentStep = 1;
      updateAgeLabel();
      document.querySelector('.stepper-nav').style.display = 'flex';
      document.getElementById('modal-footer').style.display = 'flex';
      document.getElementById('step-success').classList.remove('active');
      updateStepUI();
    }
    function handleFormSubmit(e) {
      e.preventDefault();
    }
    function calculateAge(birthDateString) {
      if (!birthDateString) return null;
      const birthDate = new Date(birthDateString);
      if (isNaN(birthDate.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 0 ? age : null;
    }
    function updateAgeLabel() {
      const input = document.getElementById('date_de_naissance');
      const label = document.getElementById('label-date-naissance');
      if (!input || !label) return;
      const age = calculateAge(input.value);
      if (age !== null && age >= 6) {
        label.innerText = \`Âge (\${age}ans) *\`;
      } else {
        label.innerText = \`Date de naissance *\`;
      }
    }
    function validateUniqueAvailabilityDates(e) {
      const target = e ? e.target : null;
      const inputs = [
        document.getElementById('date-1'),
        document.getElementById('date-2'),
        document.getElementById('date-3')
      ].filter(Boolean);
      inputs.forEach(input => input.setCustomValidity(''));
      if (target && target.value) {
        for (let other of inputs) {
          if (other !== target && other.value && other.value === target.value) {
            target.value = '';
            target.setCustomValidity('Cette date a déjà été choisie dans un autre de vos choix.');
            target.reportValidity();
            return;
          }
        }
      }
    }
    function showPopup(message, title = "Information") {
      const overlay = document.getElementById('custom-popup');
      const msgEl = document.getElementById('popup-message');
      const titleEl = document.getElementById('popup-title');
      if (msgEl && titleEl && overlay) {
        titleEl.innerText = title;
        msgEl.innerText = message;
        overlay.style.display = 'flex';
      }
    }

    function closePopup() {
      const overlay = document.getElementById('custom-popup');
      if (overlay) overlay.style.display = 'none'; sendReturnMessage({ type_msg: "annulation" });
    }

    function closePopupOnBackdrop(e) {
      if (e.target && e.target.id === 'custom-popup') {
        closePopup();
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      ['date-1', 'date-2', 'date-3'].forEach(id => {
        const dateEl = document.getElementById(id);
        if (dateEl) {
          dateEl.setAttribute('min', todayStr);
          dateEl.addEventListener('change', validateUniqueAvailabilityDates);
          dateEl.addEventListener('input', validateUniqueAvailabilityDates);
        }
      });
      const maxDate = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate()).toISOString().split('T')[0];
      const dateInput = document.getElementById('date_de_naissance');
      if (dateInput) {
        dateInput.setAttribute('max', maxDate);
        dateInput.addEventListener('input', updateAgeLabel);
        dateInput.addEventListener('change', updateAgeLabel);
        updateAgeLabel();
      }
    });
  </script>
</body>

</html>`.replace(/\s+/g, " ")

  }
}