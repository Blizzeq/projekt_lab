jest.mock('../database');
const db = require('../database');
const { addProduct } = require('../routes/products');

describe('addProduct', () => {
    it('should add a new product', async () => {
        db.run.mockImplementation(function(sql, params, callback) {
            callback.call({ lastID: 1 }, null);
        });

        const newProduct = { name: 'Product', description: 'Description', price: 100 };

        const result = await addProduct(newProduct);
        expect(result).toEqual({ id: 1 });
    });

});