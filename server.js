// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du build React (en production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Route pour traiter les investissements
app.post('/api/investment', (req, res) => {
  try {
    const { country, name, phone, network, amount, countryCode } = req.body;

    // Validation des données reçues
    if (!country || !name || !phone || !network || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validation du montant
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être un nombre positif'
      });
    }

    // Validation du numéro de téléphone (basique)
    if (!/^\d+$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de téléphone ne doit contenir que des chiffres'
      });
    }

    // Log des données reçues dans la console
    console.log('=== NOUVEAU INVESTISSEMENT REÇU ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Pays:', country);
    console.log('Nom:', name);
    console.log('Téléphone:', `${countryCode} ${phone}`);
    console.log('Réseau:', network);
    console.log('Montant:', `${amountNumber} FCFA`);
    console.log('===================================');

    // Ici, vous pouvez ajouter la logique pour sauvegarder en base de données
    // Exemple : await saveToDatabase({ country, name, phone, network, amount, countryCode });

    // Simulation d'un traitement asynchrone
    setTimeout(() => {
      console.log('Investissement traité avec succès pour:', name);
    }, 1000);

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Investissement enregistré avec succès',
      data: {
        id: Date.now(), // ID temporaire pour la démo
        country,
        name,
        phone: `${countryCode} ${phone}`,
        network,
        amount: amountNumber,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors du traitement de l\'investissement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur Africa Investment opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Route pour obtenir la liste des pays (optionnel)
app.get('/api/countries', (req, res) => {
  const africanCountries = [
    { value: 'dz', label: 'Algérie', code: '+213' },
    { value: 'ao', label: 'Angola', code: '+244' },
    { value: 'bj', label: 'Bénin', code: '+229' },
    { value: 'bw', label: 'Botswana', code: '+267' },
    { value: 'bf', label: 'Burkina Faso', code: '+226' },
    { value: 'bi', label: 'Burundi', code: '+257' },
    { value: 'cm', label: 'Cameroun', code: '+237' },
    { value: 'cv', label: 'Cap-Vert', code: '+238' },
    { value: 'cf', label: 'République centrafricaine', code: '+236' },
    { value: 'td', label: 'Tchad', code: '+235' },
    { value: 'km', label: 'Comores', code: '+269' },
    { value: 'cg', label: 'Congo', code: '+242' },
    { value: 'cd', label: 'République démocratique du Congo', code: '+243' },
    { value: 'ci', label: 'Côte d\'Ivoire', code: '+225' },
    { value: 'dj', label: 'Djibouti', code: '+253' },
    { value: 'eg', label: 'Égypte', code: '+20' },
    { value: 'gq', label: 'Guinée équatoriale', code: '+240' },
    { value: 'er', label: 'Érythrée', code: '+291' },
    { value: 'et', label: 'Éthiopie', code: '+251' },
    { value: 'ga', label: 'Gabon', code: '+241' },
    { value: 'gm', label: 'Gambie', code: '+220' },
    { value: 'gh', label: 'Ghana', code: '+233' },
    { value: 'gn', label: 'Guinée', code: '+224' },
    { value: 'gw', label: 'Guinée-Bissau', code: '+245' },
    { value: 'ke', label: 'Kenya', code: '+254' },
    { value: 'ls', label: 'Lesotho', code: '+266' },
    { value: 'lr', label: 'Liberia', code: '+231' },
    { value: 'ly', label: 'Libye', code: '+218' },
    { value: 'mg', label: 'Madagascar', code: '+261' },
    { value: 'mw', label: 'Malawi', code: '+265' },
    { value: 'ml', label: 'Mali', code: '+223' },
    { value: 'mr', label: 'Mauritanie', code: '+222' },
    { value: 'mu', label: 'Maurice', code: '+230' },
    { value: 'ma', label: 'Maroc', code: '+212' },
    { value: 'mz', label: 'Mozambique', code: '+258' },
    { value: 'na', label: 'Namibie', code: '+264' },
    { value: 'ne', label: 'Niger', code: '+227' },
    { value: 'ng', label: 'Nigeria', code: '+234' },
    { value: 'rw', label: 'Rwanda', code: '+250' },
    { value: 'st', label: 'Sao Tomé-et-Principe', code: '+239' },
    { value: 'sn', label: 'Sénégal', code: '+221' },
    { value: 'sc', label: 'Seychelles', code: '+248' },
    { value: 'sl', label: 'Sierra Leone', code: '+232' },
    { value: 'so', label: 'Somalie', code: '+252' },
    { value: 'za', label: 'Afrique du Sud', code: '+27' },
    { value: 'ss', label: 'Soudan du Sud', code: '+211' },
    { value: 'sd', label: 'Soudan', code: '+249' },
    { value: 'sz', label: 'Eswatini', code: '+268' },
    { value: 'tz', label: 'Tanzanie', code: '+255' },
    { value: 'tg', label: 'Togo', code: '+228' },
    { value: 'tn', label: 'Tunisie', code: '+216' },
    { value: 'ug', label: 'Ouganda', code: '+256' },
    { value: 'zm', label: 'Zambie', code: '+260' },
    { value: 'zw', label: 'Zimbabwe', code: '+263' }
  ];

  res.status(200).json({
    success: true,
    data: africanCountries
  });
});

// En production, servir l'app React pour toutes les autres routes
// if (process.env.NODE_ENV === 'production') {
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });
// }

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('===========================================');
  console.log(`🚀 Serveur Africa Investment démarré`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
  console.log('===========================================');
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur Africa Investment...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur Africa Investment...');
  process.exit(0);
});