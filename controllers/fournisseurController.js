const Fournisseur= require('../models/fournisseur');

// créer un fournisseur
exports.createFournisseur =async(req, res) => {
    try{
        const {name, contact, email, phone, address} = req.body;
            // le fournisseur dépend à userId
            const fournisseur = await Fournisseur.create({
                userId: req.user.id,
                name,
                contact,
                email,
                phone,
                address
            });
            res.status(201).json(fournisseur);
        }catch (error){
            res.status(422).json({message: error.message});
        }
};

// Lister ses fournisseurs
exports.getFournisseurs=async(req, res) => {
    try {
        // le client ne voit que ses données
        const fournisseurs = await Fournisseur.find({userId: req.user.id});
        res.status(200).json(fournisseurs);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};