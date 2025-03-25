// 🛡️ Middleware لحماية المسارات
authenticateToken = async(req, res, next) =>{
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });
        req.user = user;
        next();
    });
}

module.exports = {authenticateToken}