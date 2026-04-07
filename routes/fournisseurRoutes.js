const express =require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseurController');
const { authenticate } = require('../midllewares/authMiddleware');
const { isFournisseurOwner } = require('../midllewares/isOwner');

router.use(authenticate); 

router.post('/', fournisseurController.createFournisseur); 
router.get('/', fournisseurController.getFournisseurs);    

router.get('/:id', isFournisseurOwner, fournisseurController.getFournisseurById); 
router.put('/:id', isFournisseurOwner, fournisseurController.updateFournisseur); 
router.delete('/:id', isFournisseurOwner, fournisseurController.deleteFournisseur); 

module.exports = router;