const express = require('express');
const factureController = require('../controllers/factureController.js');
const { isFactureOwner } = require('../midllewares/isFactureOwner.js');
const { authenticate } = require('../midllewares/authMiddleware.js');

const router = express.Router();

router.use(authenticate);

router.post('/', factureController.createFacture);
router.get('/', isFactureOwner,factureController.getFactures);

module.exports = router;