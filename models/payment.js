const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    factureId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Facture', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: [0.01, "Le montant doit être supérieur à 0"]
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    modePaiement: { 
        type: String, 
        required: true, 
        enum: ['espèces', 'chèque', 'virement']
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);