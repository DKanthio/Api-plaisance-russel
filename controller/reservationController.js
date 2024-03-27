const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway'); // Assurez-vous que le chemin est correct

const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
    catwayNumber: String,
    clientName: String,
    boatName: String,
    checkIn: Date,
    checkOut: Date
});

exports.createReservation = async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;

        // Vérifier si le catwayNumber existe dans la base de données
        const catwayExists = await Catway.exists({ catwayNumber });

        if (!catwayExists) {
            return res.status(400).send("Le numéro de catway spécifié n'existe pas.");
        }

        // Si le catwayNumber existe, créer une nouvelle réservation
        const newReservation = new Reservation({ catwayNumber, clientName, boatName, checkIn, checkOut });
        await newReservation.save();


        res.status(201).send("Réservation enregistrée avec succès");
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la réservation :', error);
        res.status(500).send("Erreur lors de l'enregistrement de la réservation");
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;
        await Reservation.findByIdAndDelete(reservationId);
        res.status(200).send("Réservation supprimée avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de la réservation");
    }
};

exports.getReservationDetails = async (req, res) => {
    try {
        const { reservationId } = req.query;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send("Réservation non trouvée");
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des détails de la réservation");
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des réservations");
    }
};
