const jwt = require("jsonwebtoken");


let VerifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    if (!token) {
        res.status(401).json({ Success: false, Message: "No token provided" });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.decoded = decoded;
            next();
        } catch (error) {
            res.status(401).json({ Success: false, Message: "Invalid token" });
        }
    }
}

let VerifyAdmin = (req, res, next) => {
    if (req.decoded.role == "admin") {
        next();
    } else {
        res.status(401).json({ Success: false, Message: "Unauthorized Access" });
    }
}

module.exports = {
    VerifyToken,
    VerifyAdmin,
};