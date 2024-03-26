require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser"); 
const bcrypt = require('bcrypt'); 
const User = require('./models/User'); 

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB..."))
  .catch((err) => console.error("Impossible de se connecter à MongoDB...", err));

app.use(express.static(path.join(__dirname, "port-plaisance_html")));

// Schéma Mongoose pour les catways
const catwaySchema = new mongoose.Schema({
    catwayNumber: String,
    type: String,
    catwayState: String
});
const Catway = mongoose.model("Catway", catwaySchema);

// Schéma Mongoose pour les réservations
const reservationSchema = new mongoose.Schema({
    catwayNumber: String,
    clientName: String,
    boatName: String,
    checkIn: Date,
    checkOut: Date
});
const Reservation = mongoose.model("Reservation", reservationSchema);

// Endpoint pour la connexion
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Recherche de l'utilisateur dans la base de données en fonction de l'email
        const user = await User.findOne({ email });

        
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifie si le mot de passe fourni correspond au mot de passe stocké dans la base de données
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          
            return res.redirect("/dashboard.html");
        } else {
           
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});


// Endpoint pour la création d'un nouvel utilisateur
app.post("/signup", async (req, res) => {
    try {
        // Vérifie si l'utilisateur existe déjà dans la base de données
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

      
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

       
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        // Sauvegarde du nouvel utilisateur dans la base de données
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});
// Endpoint pour modifier un utilisateur
app.post("/updateUser", async (req, res) => {
    try {
        const { userId, name, email, password } = req.body;
        await User.findByIdAndUpdate(userId, { name, email, password });
        res.status(200).send("Utilisateur mis à jour avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    }
});

// Endpoint pour supprimer un utilisateur
app.post("/deleteUser", async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.status(200).send("Utilisateur supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de l'utilisateur");
    }
});

// Endpoint pour créer un catway
app.post("/createCatway", async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, type, catwayState });
        await newCatway.save();
        res.status(201).send("Catway créé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création du catway");
    }
});

// Endpoint pour modifier la description de l'état d'un catway
app.post("/updateCatwayState", async (req, res) => {
    try {
        const { catwayId, catwayState } = req.body;
        await Catway.findByIdAndUpdate(catwayId, { catwayState });
        res.status(200).send("Description de l'état du catway mise à jour avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour de la description de l'état du catway");
    }
});

// Endpoint pour supprimer un catway
app.post("/deleteCatway", async (req, res) => {
    try {
        const { catwayId } = req.body;
        await Catway.findByIdAndDelete(catwayId);
        res.status(200).send("Catway supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression du catway");
    }
});

// Endpoint pour enregistrer une réservation
app.post("/createReservation", async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, checkIn, checkOut } = req.body;
        const newReservation = new Reservation({ catwayNumber, clientName, boatName, checkIn, checkOut });
            await newReservation.save();
            res.status(201).send("Réservation enregistrée avec succès");
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de l'enregistrement de la réservation");
        }
    });
    
    // Endpoint pour supprimer une réservation
app.post("/deleteReservation", async (req, res) => {
        try {
            const { reservationId } = req.body;
            await Reservation.findByIdAndDelete(reservationId);
            res.status(200).send("Réservation supprimée avec succès");
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la suppression de la réservation");
        }
    });

// Endpoint pour afficher les détails d'un catway
app.get("/getCatwayDetails", async (req, res) => {
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
});


// Endpoint pour afficher les détails d'une réservation
app.get("/getReservationDetails", async (req, res) => {
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
});
// Endpoint pour récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
});

// Endpoint pour lister l'ensemble des réservations
app.get("/reservations", async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des réservations");
    }
});

// Endpoint pour lister tous les catways
app.get("/catways", async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des catways");
    }
});



    // Démarrer le serveur
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Serveur en cours d'exécution sur le port ${port}...`);
    });
    
    module.exports = app;
