const express = require('express');
const factureController = require('../controllers/factureController.js');
const { authenticate } = require('../middlewares/authMiddleware.js');
const { isFactureOwner } = require('../midllewares/isFactureOwner.js');

const router = express.Router();

router.use(authenticate);

router.post('/', factureController.createFacture);
router.get('/', isFactureOwner,factureController.getFactures);

module.exports = router;