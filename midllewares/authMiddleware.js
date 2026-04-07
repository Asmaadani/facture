const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    // Récupération du token dans le header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // j'ajoute les infos du user (id, role) à la requête
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré." }); 
    }
};