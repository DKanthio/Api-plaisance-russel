const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "L'utilisateur n'existe pas." });
        }

        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }


        res.status(200).json({ message: "Connexion réussie."});
     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la connexion." });
    }
});



