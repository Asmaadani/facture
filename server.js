const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fournisseurRoutes = require('./routes/fournisseurRoutes');
const factureRoutes = require('./routes/factureRoutes');
const statRoutes = require('./routes/statRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(express.json()); 


app.use('/api/auth', authRoutes);

app.use('/api/fournisseurs', fournisseurRoutes);

app.use('/api/factures', factureRoutes);

app.use('/api/stats', statRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});