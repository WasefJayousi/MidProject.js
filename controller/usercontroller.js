const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {GetConnection} = require('../database/connection');
const { sendOTP } = require('../config/email');

// const nodemailer = require('nodemailer');


// const transporter = nodemailer.createTransport({
//     service: 'gmail', // use gmail
//     auth: {
//         user: 'yazankamseh@gmail.com',  //my account
//         pass: 'y j d d g r d b a t u j a r s u'  // my app password 
//     }
// });

// // to send email
// const sendEmail = async (to, subject, text) => {
//     try {
//         const mailOptions = {
//             from: 'yazankamseh@gmail.com', 
//             to: to,   //reseverrrrr
//             subject: subject, 
//             text: text  
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent: ' + info.response);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

//http://localhost:5000/api/users/verify-otp
const verifyOTP = async(req, res ,next) => {
    try {
         const { email, otp } = req.body;
    const connection = GetConnection()
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email])
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        if (user.is_verified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        if (user.otp_code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date(user.otp_expires) < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        await connection.query('UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires = NULL WHERE email = ?', [email])

        return res.json({ message: 'Email verified successfully' });   
    } catch (error) {
        console.log(error)
        next(error)
    }}


//y j d d g r d b a t u j a r s u


// register ----------http://localhost:5000/api/users/register
const registerUser = async(req, res , next) => {
    try {
    const { name, email, password, phone, address } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);  
    console.log(otpExpires)

    const connection = GetConnection()
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email])
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.query(
            'INSERT INTO users (name, email, password, phone, address, otp_code, otp_expires) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address, otp, otpExpires]);
        await sendOTP(email, otp);
        return res.status(201).json({ message: 'OTP sent. Please verify your email.' });
    } catch (error) {
        console.log(error)
        next(error)
    }
};

// login----------http://localhost:5000/api/users/login
const loginUser = async(req, res,next) => {
    try {
    const { emailOrName, password } = req.body;

    const connection = GetConnection()
    const [results] = await connection.query('SELECT * FROM users WHERE email = ? OR name = ?', [emailOrName, emailOrName])
        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).json({ message: 'Invalid email, name, or password' });
        }

        if (!results[0].is_verified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        return res.json({ message: 'Login successful', token });       
    } catch (error) {
        console.log(error)
        next(error)
    }
};

//  Fetch User --------http://localhost:5000/api/users/profile
const getUserProfile = async(req, res) => {
    try {
    const connection = GetConnection()
    const [results] = await connection.query('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.user.id])
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        return res.json(results[0]);
    } catch (error) {
        console.log(error)
    }

};

// update profile-------------- http://localhost:5000/api/users/profile
const updateUserProfile = async (req, res, next) => {
    try {
        const { name, phone, address, password } = req.body;
        const userId = req.user.id;

        let fields = [];
        let values = [];

        if (name) {
            fields.push("name = ?");
            values.push(name);
        }

        if (phone) {
            fields.push("phone = ?");
            values.push(phone);
        }

        if (address) {
            fields.push("address = ?");
            values.push(address);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push("password = ?");
            values.push(hashedPassword);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "There is no field to update." });
        }

        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        values.push(userId);

        const connection = GetConnection();
        await connection.query(sql, values);

        res.json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error(error);
        next(error);
    }
};




//delete user--------------http://localhost:5000/api/users/profile
const deleteUser = async(req,res,next) => {
    try {
    const connection = GetConnection()
    await connection.query('DELETE FROM users WHERE id = ?', [req.user.id])
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.json({ message: 'User deleted successfully' }); 
    } catch (error) {
        console.log(error)
        next(error)
    }
};


const logoutUser = (req, res) => {
    try {
        res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'Strict',
    }); 
    return res.json({ message: 'Logged out successfully' });  
    } catch (error) {
        console.log(error)
    }

};
// Forgot Password - Request OTP
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const connection = GetConnection();
        const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        await connection.query('UPDATE users SET otp_code = ?, otp_expires = ? WHERE email = ?', [otp, otpExpires, email]);
        await sendOTP(email, otp);

        return res.json({ message: 'OTP sent to your email. Please verify.' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        const connection = GetConnection();

        const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        if (user.otp_code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date(user.otp_expires) < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await connection.query(
            'UPDATE users SET password = ?, otp_code = NULL, otp_expires = NULL WHERE email = ?',
            [hashedPassword, email]
        );

        return res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        console.log(error);
        next(error);
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,  logoutUser,verifyOTP,forgotPassword,resetPassword

};