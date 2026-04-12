const Fournisseur= require('../models/fournisseur');
const Facture = require('../models/facture');

exports.createFournisseur =async(req, res) => {
    try{
        const {name, contact, email, phone, address} = req.body;
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

exports.getFournisseurs=async(req, res) => {
    try {
        // le client ne voit que ses données
        const fournisseurs = await Fournisseur.find({userId: req.user.id});
        res.status(200).json(fournisseurs);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

exports.getFournisseurById = async (req, res) => {
    try {
        const fournisseur = req.fournisseur;

        const invoiceCount = await Facture.countDocuments({ 
            fournisseurId: fournisseur._id,
            userId: req.user.id 
        });

        res.status(200).json({
            ...fournisseur._doc,
            invoiceCount: invoiceCount 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFournisseur = async (req, res) => {
    try {
        const updates = req.body;
        
        if (updates.name && updates.name.length < 2) {
            return res.status(422).json({ message: "Le nom doit avoir au moins 2 caractères" });
        }

        const updatedFournisseur = await Fournisseur.findByIdAndUpdate(
            req.params.id,     
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedFournisseur); 
    } catch (error) {
        res.status(422).json({ message: error.message });
    }
};
exports.deleteFournisseur = async (req, res) => {
    try {
        await Fournisseur.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Fournisseur supprimé" }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};