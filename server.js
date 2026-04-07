const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fournisseurRoutes = require('./routes/fournisseurRoutes');
// Chargement des variables d'environnement
dotenv.config();

connectDB();

const app = express();


// Middlewares globaux
app.use(cors());
app.use(express.json()); 


app.use('/api/auth', authRoutes);

app.use('/api/fournisseurs', fournisseurRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('API Facturation Opérationnelle !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});