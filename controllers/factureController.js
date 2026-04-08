const Facture = require('../models/facture');

// créer la facture
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

// lister les factures

exports.getFactures = async (req, res) =>{
    try{
        const {status, fournisseurId}= req.query;
        let query = {userId: req.user.id};
        // filte optionnels
        if(status) query.status = status;
        if (fournisseurId) query.fournisseurId = fournisseurId;

        const factures= await Facture.find(query).populate('fournisseurId', 'name');
        
        // pour marquer comme overdue
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