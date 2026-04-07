const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true // Pour garantir l'isolation des données [cite: 14, 22]
    },
    name: { 
        type: String, 
        required: true, 
        minlength: 2 // [cite: 94]
    },
    contact: String,
    email: { 
        type: String, 
        lowercase: true 
    },
    phone: String,
    address: String
}, { timestamps: true });

module.exports = mongoose.model('Fournisseur', fournisseurSchema);