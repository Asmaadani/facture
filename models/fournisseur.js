const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true, 
        minlength: 2 
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