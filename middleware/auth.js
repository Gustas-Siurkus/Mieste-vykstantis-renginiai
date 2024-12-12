const jwt = require("jsonwebtoken");

// Middleware to verify user token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Prieiga uždrausta. Nėra token." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "secretKey"); // Naudojame aplinkos kintamąjį
        req.user = decoded; // Pridedame vartotojo informaciją į užklausą
        next();
    } catch (err) {
        console.error("Klaida tikrinant token:", err.message);
        res.status(403).json({ message: "Prieiga uždrausta. Token neteisingas arba pasibaigęs." });
    }
};

// Middleware to verify if user is admin
const verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) { // Tikriname, ar vartotojas yra adminas
        return res.status(403).json({ message: "Prieiga uždrausta. Neturite teisės." });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
