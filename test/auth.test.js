jest.mock('../database');
jest.mock('bcryptjs', () => ({
    compare: jest.fn()
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mockedToken')
}));

const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByUsername, loginUser } = require('../routes/auth');

const secret = 'secret';

describe('getUserByUsername', () => {
    it('should find a user by username', async () => {
        const fakeUser = { id: 1, username: 'testuser' };
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, fakeUser);
        });

        const user = await getUserByUsername('testuser');
        expect(user).toEqual(fakeUser);
    });

    it('should handle errors', async () => {
        const error = new Error('Database error');
        db.get.mockImplementation((sql, params, callback) => {
            callback(error);
        });

        await expect(getUserByUsername('testuser')).rejects.toThrow('Database error');
    });
});

describe('loginUser', () => {
    it('should login a user with correct credentials', async () => {
        const fakeUser = { id: 1, username: 'test1', password: 'test1', isAdmin: 1 };
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, fakeUser);
        });
        bcrypt.compare.mockResolvedValue(true);

        const result = await loginUser('test1', 'test1');
        expect(result).toEqual({ token: 'mockedToken', isAdmin: fakeUser.isAdmin });
        expect(jwt.sign).toHaveBeenCalledWith({ id: fakeUser.id, username: fakeUser.username, isAdmin: fakeUser.isAdmin }, secret, { expiresIn: '1h' });
    });

    it('should reject with an error for invalid credentials', async () => {
        db.get.mockImplementation((sql, params, callback) => {
            callback(null, null); 
        });

        await expect(loginUser('testuser', 'wrongpassword')).rejects.toThrow('Invalid username or password');
    });
});
