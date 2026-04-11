const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate); 

router.get('/dashboard', authenticate, statController.getGlobalDashboard);
router.get('/fournisseurs/:id', authenticate, statController.getFournisseurStats);

module.exports = router;