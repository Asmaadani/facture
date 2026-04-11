const express = require('express');
const factureController = require('../controllers/factureController.js');
const { isFactureOwner } = require('../midllewares/isFactureOwner.js');
const { authenticate } = require('../midllewares/authMiddleware.js');
const paymentController = require ('../controllers/paymentController');

const router = express.Router();

router.use(authenticate);

router.post('/', factureController.createFacture);
router.get('/', isFactureOwner,factureController.getFactures);

router.get('/:id', isFactureOwner, factureController.getFactureById);
router.put('/:id', isFactureOwner, factureController.updateFacture);
router.delete('/:id', isFactureOwner, factureController.deleteFacture);

router.post('/:id/payments', isFactureOwner, paymentController.createPayment);
router.get('/:id/payments', isFactureOwner, paymentController.getPaymentsByFacture);
module.exports = router;
