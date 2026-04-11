const Payment = require('../models/payment'); 
const Facture = require('../models/facture');

exports.createPayment = async (req, res) => {
    try {
        const { amount, modePaiement } = req.body;
        
        const facture = req.facture; 

        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée dans la requête" });
        }

        const payments = await Payment.find({ factureId: facture._id });
        const alreadyPaid = payments.reduce((acc, p) => acc + p.amount, 0);
        const remaining = facture.amount - alreadyPaid;

        if (Number(amount) > remaining) {
            return res.status(422).json({ 
                message: `Le montant dépasse le reste à payer (${remaining} DH).` 
            });
        }

        const newPayment = await Payment.create({
            factureId: facture._id,
            userId: req.user.id,
            amount: Number(amount),
            modePaiement
        });

        const totalNow = alreadyPaid + Number(amount);
        
        if (totalNow >= facture.amount) {
            facture.status = 'paid';
        } else {
            facture.status = 'partially_paid';
        }
        
        await facture.save();

        res.status(201).json({ 
            message: "Paiement enregistré",
            payment: newPayment, 
            factureStatus: facture.status,
            resteAPayer: facture.amount - totalNow
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPaymentsByFacture = async (req, res) => {
    try {
        const payments = await Payment.find({ factureId: req.facture._id })
            .sort({ paymentDate: -1 }); 

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};