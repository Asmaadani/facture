const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { name, email, password, password_confirmation } = req.body;

        if (password !== password_confirmation) {
            return res.status(422).json({ message: "Les mots de passe ne correspondent pas" });
        }

        const user = await User.create({ name, email, password });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(200).json({ 
            message: "Connexion réussie",
            token 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};