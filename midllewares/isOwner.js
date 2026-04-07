const Fournisseur = require('../models/fournisseur');

exports.isFournisseurOwner = async (req, res, next) => {
    try {
        const fournisseur = await Fournisseur.findById(req.params.id);

        if (!fournisseur) {
            return res.status(404).json({ message: "Fournisseur inexistant" }); 
        }

        if (fournisseur.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé : ce n'est pas votre fournisseur" });
        }

        req.fournisseur = fournisseur;
        next();
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la vérification de propriété" });
    }
};