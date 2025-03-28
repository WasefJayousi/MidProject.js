const bcrypt = require('bcrypt')
const {GetConnection} = require('../database/connection')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const db = GetConnection()
        const [result] = await db.query(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]
        );
        res.status(201).json({ userId: result.insertId, message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const db = GetConnection()
        const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: "Email or password incorrect" });
        }

        const user = users[0];
        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Email or password incorrect" });
        }
        const TOKEN_EXPIRY = '1h'
        const REFRESH_EXPIRY = '7d'
        // إنشاء التوكنات
        const accessToken = jwt.sign({ id: user.userid }, process.env.SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ id: user.userid }, process.env.REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

        return res.status(200).json({ message: "Login successful", accessToken, refreshToken });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
