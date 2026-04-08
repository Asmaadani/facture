const mongoose= require ('mongoose');

const factureSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fournisseurId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur',
        required:true
    },
    amount:{
        type: Number,
        required: true,
        min: [0.01, "le montant doit etre supérieur à 0"]
    },
    dueDate:{
        type: Date,
        required: true
    },
    description: String,
    status:{
        type: String,
        enum: ['unpaid','partially_paid','paid'],
        default: 'unpaid'
    }
},{timestamps: true});

module.exports = mongoose.model('Facture',factureSchema);