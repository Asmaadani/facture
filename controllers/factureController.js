const Facture = require('../models/facture');
const Payment = require('../models/payment'); 

exports.createFacture = async (req, res)=>{
    try{
        const {fournisseurId, amount, dueDate, description} = req.body;

        const facture = await Facture.create({
            userId: req.user.id,
            fournisseurId,
            amount,
            dueDate,
            description
        });
        res.status(201).json(facture);
    }catch (error){
        res.status(422).json({message: error.message});
    }
};


exports.getFactures = async (req, res) =>{
    try{
        const {status, fournisseurId}= req.query;

        let query = {};
        if (req.user.role !== 'admin') {
            query.userId = req.user.id; 
        }

        if(status) query.status = status;
        if (fournisseurId) query.fournisseurId = fournisseurId;

        const factures= await Facture.find(query).populate('fournisseurId', 'name');
        
        const updateFactures= factures.map(inv => {
            if( inv.status !== 'paid' && new Date( inv.dueDate)< new Date()){
                inv.status = 'overdue';
            }
            return inv;
        });
        res.status(200).json(updateFactures);
    }catch (error){
        res.status(500).json({message: error.message});
    }
};

exports.getFactureById = async (req, res) => {
    try {
        const facture = await Facture.findById(req.params.id).populate('fournisseurId');
        res.status(200).json(facture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFacture = async (req, res) => {
    try {
        const facture = req.facture;

        if (facture.status === 'paid') {
            return res.status(422).json({ 
                message: "Interdit : Impossible de supprimer une facture dont le statut est 'paid'." 
            });
        }

        const paymentCount = await Payment.countDocuments({ factureId: facture._id });
        
        if (paymentCount > 0) {
            return res.status(422).json({ 
                message: "Impossible de supprimer une facture ayant des paiements enregistrés." 
            });
        }

        await Facture.findByIdAndDelete(facture._id);
        res.status(200).json({ message: "Facture supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFacture = async (req, res) => {
    try {
        const facture = req.facture;

        if (facture.status === 'paid') {
            return res.status(422).json({ 
                message: "Une facture déjà payée ne peut pas être modifiée." 
            });
        }

        const updatedFacture = await Facture.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedFacture);
    } catch (error) {
        res.status(422).json({ message: error.message });
    }
};