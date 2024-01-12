const db = require('../db/database');
const logger = require('../log/logger');

async function getAllProducts() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM products';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function editProduct(id, updatedProduct) {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?';
        const params = [updatedProduct.name, updatedProduct.description, updatedProduct.price, id];
        
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                logger.info(`Product ${updatedProduct.name} successfully updated.`);
                resolve({ id: this.lastID });
            }
        });
    });
}

async function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM products WHERE id = ?';
        
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else {
                logger.info(`Product with ID = ${id} successfully deleted.`);
                resolve({ id: this.lastID });
            }
        });
    });
}

async function addProduct(newProduct) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO products (name, description, price) VALUES (?, ?, ?)';
        const params = [newProduct.name, newProduct.description, newProduct.price];

        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                logger.info(`Product ${newProduct.name} successfully added.`);
                resolve({ id: this.lastID });
            }
        });
    });
}

module.exports = { getAllProducts, editProduct, deleteProduct, addProduct };