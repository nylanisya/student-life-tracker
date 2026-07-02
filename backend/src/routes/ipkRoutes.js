const express = require('express');
const router = express.Router();
const ipkController = require('../controllers/ipkController');
// Routes
router.get('/', ipkController.getIpkHistory);
router.get('/current', ipkController.getCurrentIpk);
router.post('/', ipkController.addIpk);
router.put('/:id', ipkController.updateIpk);
router.delete('/:id', ipkController.deleteIpk);
module.exports = router;
