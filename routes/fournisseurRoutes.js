const express =require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseurController');
const { authenticate } = require('../midllewares/authMiddleware');

router.use(authenticate); 

router.post('/', fournisseurController.createFournisseur); 
router.get('/', fournisseurController.getFournisseurs);    

module.exports = router;