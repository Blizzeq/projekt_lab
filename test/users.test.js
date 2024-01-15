jest.mock('../database');
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword')
}));

const db = require('../database');
const bcrypt = require('bcryptjs');
const { addUser, getAllUsers } = require('../routes/users');

describe('getAllUsers', () => {
    it('should return all users', async () => {
        const fakeUsers = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
        db.all.mockImplementation((sql, params, callback) => {
            callback(null, fakeUsers);
        });

        const users = await getAllUsers();
        expect(users).toEqual(fakeUsers);
    });
});

describe('addUser', () => {
    it('should add a new user', async () => {
        db.run.mockImplementation(function(sql, params, callback) {
            callback.call({ lastID: 1 }, null);
        });

        const newUser = {
            firstName: 'firstName',
            lastName: 'lastName',
            username: 'username',
            password: 'password',
            email: 'email@gmail.com',
            phone: '1234567890',
            isAdmin: '0'
        };

        const result = await addUser(newUser);
        expect(result).toEqual({ id: 1 });
        expect(bcrypt.hash).toHaveBeenCalledWith('password', 8);
    });

});
