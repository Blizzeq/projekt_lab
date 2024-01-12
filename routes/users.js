const db = require('../db/database');
const bcrypt = require('bcryptjs');
const logger = require('../log/logger');

async function getAllUsers() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function editUser(id, userData) {
    try {
        const isAdmin = userData.isAdmin === '1' ? 1 : 0;
        
        let updateFields = [];
        let params = [];

        if (userData.firstName) {
            updateFields.push("firstName = ?");
            params.push(userData.firstName);
        }
        if (userData.lastName) {
            updateFields.push("lastName = ?");
            params.push(userData.lastName);
        }
        if (userData.username) {
            updateFields.push("username = ?");
            params.push(userData.username);
        }
        if (userData.email) {
            updateFields.push("email = ?");
            params.push(userData.email);
        }
        if (userData.phone) {
            updateFields.push("phone = ?");
            params.push(userData.phone);
        }
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 8);
            updateFields.push("password = ?");
            params.push(hashedPassword);
        }
        updateFields.push("isAdmin = ?");
        params.push(isAdmin);

        params.push(id);
        const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    logger.info(`User ${userData.username} successfully updated.`);
                    resolve({ id: this.lastID });
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else {
                logger.info(`User with ID = ${id} successfully deleted.`);
                resolve({ id: this.lastID });
            }
        });
    });
}

async function addUser(userData) {
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
                    logger.info(`User ${userData.username} successfully added.`);
                    resolve({ id: this.lastID });
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllUsers, editUser, deleteUser, addUser };
