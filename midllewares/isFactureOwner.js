const Facture = require('../models/facture');

exports.isFactureOwner = async (req, res, next) => {
    try {
        const facture = await Facture.findById(req.params.id);
        if (!facture) return res.status(404).json({ message: "Facture introuvable" });

        if (facture.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        
        req.facture = facture;
        next();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};