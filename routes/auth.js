const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../log/logger');

const secret = 'secret';

async function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], async (err, user) => {
            if (err) {
                reject(err);
            } else {
                if (user && await bcrypt.compare(password, user.password)) {
                    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, secret, { expiresIn: '1h' });
                    logger.info(`User ${username} logged in successfully.`);
                    resolve({ token, isAdmin: user.isAdmin });
                } else {
                    logger.warn(`Failed login attempt for ${username}.`);
                    reject(new Error('Invalid username or password'));
                }
            }
        });
    });
}

async function registerUser(userData) {
    console.log(userData);
    if (!userData.password) {
        throw new Error("Password is required");
    }

    const existingUser = await getUserByUsername(userData.username);
    if (existingUser) {
        logger.warn(`Username ${existingUser} exist in database`);
        throw new Error("Użytkownik o takiej nazwie już istnieje.");
    }

    try {
        const hashedPassword = await bcrypt.hash(userData.password, 8);

        const isAdmin = userData.isAdmin === '1' ? 1 : 0;
        const sql = 'INSERT INTO users (firstName, lastName, username, password, email, phone, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [userData.firstName, userData.lastName, userData.username, hashedPassword, userData.email, userData.phone, isAdmin];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    logger.info(`User ${userData.username} register successfully.`);
                    resolve({ id: this.lastID });
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }

    next();
}

module.exports = { registerUser, loginUser, getUserByUsername, verifyToken };
