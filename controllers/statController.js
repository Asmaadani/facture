const mongoose = require('mongoose');
const Facture = require('../models/facture');

exports.getFournisseurStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        //Total des factures "pourcentage"
        const allFactures = await Facture.find({ userId });
        const globalTotal = allFactures.reduce((acc, inv) => acc + inv.amount, 0);

        //Total de facture d'un fournisseur spécifique
        const fournisseurFactures = await Facture.find({ userId, fournisseurId: id });
        const fournisseurTotal = fournisseurFactures.reduce((acc, inv) => acc + inv.amount, 0);

        //le pourcentage
        const percentage = globalTotal > 0 ? (fournisseurTotal / globalTotal) * 100 : 0;

        res.status(200).json({
            fournisseurTotal,
            globalTotal,
            percentage: percentage.toFixed(2) + "%",
            count: fournisseurFactures.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGlobalDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Facture.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: "$status",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }
            }}
        ]);

        const topFournisseurs = await Facture.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: "$fournisseurId",
                totalSpent: { $sum: "$amount" }
            }},
            { $sort: { totalSpent: -1 } },
            { $limit: 3 },
            { $lookup: { 
                from: "fournisseurs",
                localField: "_id",
                foreignField: "_id",
                as: "details"
            }}
        ]);

        res.status(200).json({
            overview: stats,
            topFournisseures: topFournisseures
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};