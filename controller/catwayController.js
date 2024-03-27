const Catway = require('../models/Catway');
const mongoose = require('mongoose');
const catwaySchema = new mongoose.Schema({
    catwayNumber: String,
    type: String,
    catwayState: String
});

exports.createCatway = async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, type, catwayState });
        await newCatway.save();
        res.status(201).send("Catway créé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création du catway");
    }
};

exports.updateCatwayState = async (req, res) => {
    try {
        const { catwayId, catwayState } = req.body;
        await Catway.findByIdAndUpdate(catwayId, { catwayState });
        res.status(200).send("Description de l'état du catway mise à jour avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour de la description de l'état du catway");
    }
};

exports.deleteCatway = async (req, res) => {
    try {
        const { catwayId } = req.body;
        await Catway.findByIdAndDelete(catwayId);
        res.status(200).send("Catway supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression du catway");
    }
};

exports.getCatwayDetails = async (req, res) => {
    try {
        const { catwayId } = req.query;
        const catway = await Catway.findById(catwayId);
        if (!catway) {
            return res.status(404).send("Catway non trouvé");
        }
        res.status(200).send(catway);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des détails du catway");
    }
};
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des catways");
    }
};
