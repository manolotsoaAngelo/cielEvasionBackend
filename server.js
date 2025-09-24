import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Stockage en mémoire (remplace par une base de données en production)
const wixSessions = new Map();

// Clé API Wix (à configurer dans les paramètres Wix)
const WIX_API_KEY = process.env.WIX_API_KEY;
const WIX_APP_ID = process.env.WIX_APP_ID;

// 📨 ENDPOINT POUR RECEVOIR LES MESSAGES DE WIX
app.post('/api/wix/webhook', async (req, res) => {
  try {
    console.log('📥 Message reçu de Wix:', req.body);
    
    const { eventType, data, instanceId } = req.body;
    
    // Vérifier la signature (sécurité importante)
    const signature = req.headers['x-wix-signature'];
    if (!verifyWixSignature(signature, req.body)) {
      return res.status(401).json({ error: 'Signature invalide' });
    }
    
    // Traiter différents types d'événements Wix
    switch (eventType) {
      case 'order.created':
        await handleNewOrder(data);
        break;
      
      case 'contact.created':
        await handleNewContact(data);
        break;
      
      case 'message.received':
        await handleMessageFromWix(data);
        break;
      
      default:
        console.log('Événement non géré:', eventType);
    }
    
    // Répondre à Wix
    res.json({ 
      status: 'success', 
      message: 'Webhook traité avec succès',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur webhook Wix:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// 🎯 Traitement des messages de Wix
async function handleMessageFromWix(messageData) {
  console.log('💬 Message de Wix:', messageData);
  
  // Exemple: Répondre automatiquement
  const autoReply = {
    message: `Merci pour votre message! Nous traitons votre demande concernant: ${messageData.subject}`,
    originalMessageId: messageData.id,
    timestamp: new Date().toISOString()
  };
  
  // Envoyer la réponse vers Wix
  await sendToWix('messages/reply', autoReply);
}

// 🛒 Traitement des nouvelles commandes
async function handleNewOrder(orderData) {
  console.log('🛍️ Nouvelle commande Wix:', orderData);
  
  // Traiter la commande (stock, notification, etc.)
  const orderInfo = {
    orderId: orderData.id,
    total: orderData.totals?.total,
    items: orderData.lineItems,
    customer: orderData.buyerInfo
  };
  
  // Envoyer confirmation à Wix
  await sendToWix('orders/update', {
    orderId: orderData.id,
    status: 'processed',
    notes: 'Commande traitée par le système Node.js'
  });
}

// 👤 Traitement des nouveaux contacts
async function handleNewContact(contactData) {
  console.log('👥 Nouveau contact Wix:', contactData);
  
  // Ajouter à votre CRM ou envoyer un email de bienvenue
  const welcomeData = {
    contactId: contactData.id,
    email: contactData.email,
    message: 'Bienvenue sur notre plateforme!',
    campaign: 'welcome-series'
  };
  
  await sendToWix('contacts/email', welcomeData);
}

// 📤 FONCTION POUR ENVOYER DES MESSAGES VERS WIX
async function sendToWix(endpoint, data) {
  try {
    const response = await axios.post(
      `https://www.wixapis.com/${endpoint}`,
      data,
      {
        headers: {
          'Authorization': WIX_API_KEY,
          'Content-Type': 'application/json',
          'wix-site-id': WIX_APP_ID
        }
      }
    );
    
    console.log('✅ Message envoyé à Wix:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erreur envoi vers Wix:', error.response?.data || error.message);
    throw error;
  }
}

// 🔒 Vérification de signature (sécurité)
function verifyWixSignature(signature, payload) {
  // Implémentez la vérification de signature selon la doc Wix
  // Pour le développement, vous pouvez retourner true temporairement
  return true; // ⚠️ À remplacer en production
}

// 🌐 API POUR ENVOYER DES MESSAGES À WIX (depuis d'autres systèmes)
app.post('/api/send-to-wix', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    let endpoint, messageData;
    
    switch (type) {
      case 'message':
        endpoint = 'messages/send';
        messageData = {
          to: data.contactId,
          subject: data.subject,
          body: data.message
        };
        break;
      
      case 'order_update':
        endpoint = 'orders/status';
        messageData = {
          orderId: data.orderId,
          newStatus: data.status,
          notification: data.notification || true
        };
        break;
      
      case 'notification':
        endpoint = 'notifications/send';
        messageData = {
          recipients: data.recipients,
          title: data.title,
          message: data.message,
          type: data.type || 'info'
        };
        break;
      
      default:
        return res.status(400).json({ error: 'Type de message non supporté' });
    }
    
    const result = await sendToWix(endpoint, messageData);
    
    res.json({
      success: true,
      messageId: result.id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi vers Wix',
      details: error.message 
    });
  }
});

// 📊 Endpoint de statut
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'Wix-Node.js Integration',
    timestamp: new Date().toISOString(),
    wixSessions: wixSessions.size
  });
});

// 🚀 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Node.js connecté à Wix`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Statut: http://localhost:${PORT}/api/status`);
});