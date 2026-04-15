const mongoose = require('mongoose');
const Facture = require('../models/facture');

exports.getFournisseurStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const allFactures = await Facture.find({ userId });
        const globalTotal = allFactures.reduce((acc, inv) => acc + inv.amount, 0);

        const fournisseurFactures = await Facture.find({ userId, fournisseurId: id });
        const fournisseurTotal = fournisseurFactures.reduce((acc, inv) => acc + inv.amount, 0);

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
        
        let matchFilter = {};
        if (req.user.role !== 'admin') {
            matchFilter.userId = new mongoose.Types.ObjectId(req.user.id);
        }

        //Calcul des totaux par statut (Dépenses, Retards, Total factures)
        const stats = await Facture.aggregate([
            { $match: matchFilter }, 
            { 
                $group: {
                    _id: null,
                    totalInvoices: { $sum: 1 }, 
                    totalAmount: { $sum: "$amount" }, 
                    unpaidAmount: { 
                        $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, "$amount", 0] } 
                    },
                    partiallyPaidAmount: { 
                        $sum: { $cond: [{ $eq: ["$status", "partially_paid"] }, "$amount", 0] } 
                    },
                    paidAmount: { 
                        $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } 
                    },
                    overdueCount: { 
                        $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } 
                    }
                }
            }
        ]);



        //Dépenses les plus élevées
        const topFournisseurs = await Facture.aggregate([
            { $match: matchFilter }, 
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
            }},
            { $unwind: "$details" }
        ]);

        const dashboardData = stats.length > 0 ? stats[0] : {
            totalInvoices: 0,
            totalAmount: 0,
            unpaidAmount: 0,
            partiallyPaidAmount: 0,
            paidAmount: 0,
            overdueCount: 0
        };

        res.status(200).json({
            role: req.user.role,
            summary: {
                totalFactures: dashboardData.totalInvoices,
                depensesTotales: dashboardData.totalAmount,
                resteAPayer: dashboardData.unpaidAmount + dashboardData.partiallyPaidAmount,
                nombreRetards: dashboardData.overdueCount
            },
            topFournisseurs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMonthlySummary = async (req,res) =>{

    let MonthlyFilter={};
    if (req.user.role!=="admin"){
        MonthlyFilter.userId= new mongoose.Types.ObjectId(req.user.id);
    };

    const MonthlyInvoices = await Facture.aggregate([
        {$match : MonthlyFilter},

        {$group :{
            _id:null,
            totalFacture :{$sum :1},
            totalMontantFacture :{$sum: "amount"},
            totalFactureUnpaid :{
                $sum :{$cond :[{$eq:["$status","unpaid"]}, "$amount" , 0]}
            }
        }}
    ]);

    const MonthlyData = MonthlyInvoices.length > 0 ? MonthlyInvoices[0] : {
            totalFacture: 0,
            totalMontantFacture: 0,
            totalFactureUnpaid: 0,
        };
}
