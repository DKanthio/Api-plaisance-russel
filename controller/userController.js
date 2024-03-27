const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = async (req, res) => {
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
};

exports.signup = async (req, res) => {
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
};

exports.updateUser = async (req, res) => {
    try {
        const { userId, name, email, password } = req.body;
        await User.findByIdAndUpdate(userId, { name, email, password });
        res.status(200).send("Utilisateur mis à jour avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.status(200).send("Utilisateur supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de l'utilisateur");
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
};
