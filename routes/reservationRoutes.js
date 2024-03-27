const express = require('express');
const router = express.Router();
const reservationController = require('../controller/reservationController');

router.post('/createReservation', reservationController.createReservation);
router.post('/deleteReservation', reservationController.deleteReservation);
router.get('/getReservationDetails', reservationController.getReservationDetails);
router.get('/reservations', reservationController.getAllReservations);

module.exports = router;
