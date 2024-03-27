const express = require('express');
const router = express.Router();
const catwayController = require('../controller/catwayController');

router.post('/createCatway', catwayController.createCatway);
router.post('/updateCatwayState', catwayController.updateCatwayState);
router.post('/deleteCatway', catwayController.deleteCatway);
router.get('/getCatwayDetails', catwayController.getCatwayDetails);
router.get('/catways', catwayController.getAllCatways);

module.exports = router;
