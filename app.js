const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const csrf = require('csurf');
const auth = require('./routes/auth');
const products = require('./routes/products');
const users = require('./routes/users');
const db = require('./db/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 48 * 60 * 60 * 1000
}));
// app.use(csrf());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { errorMessage: 'Wystąpił błąd serwera' });
});

app.use(express.urlencoded({ extended: true }));
app.use('/style', express.static('views/style'));

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    try {
        const result = await auth.loginUser(req.body.username, req.body.password);
        req.session.token = result.token;

        if (result.isAdmin) {
            res.redirect('/dashboard');
        } else {
            res.redirect('/products');
        }
    } catch (error) {
        res.render('login', { error: 'Niepoprawny login bądź hasło' });
    }
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    try {
        const user = await auth.registerUser(req.body);
        res.redirect('/login');
    } catch (error) {
        if (error.message === "Użytkownik o takiej nazwie istnieje.") {
            res.render('register', { error: error.message });
        } else {
            res.status(500).send(error.message);
        }
    }
});

app.get('/dashboard', auth.verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const allProducts = await products.getAllProducts();
            const allUsers = await users.getAllUsers();
            res.render('dashboard', { products: allProducts, users: allUsers });
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).render('error', { errorMessage: 'Dostęp zabroniony' });
    }
});

app.get('/products', auth.verifyToken, async (req, res) => {
    if (req.user.isAdmin || !req.user.isAdmin) {
        try {
            const allProducts = await products.getAllProducts();
            res.render('products', { products: allProducts });
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).render('error', { errorMessage: 'Dostęp zabroniony' });
    }
});

app.get('/edit-product/:id', auth.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'SELECT * FROM products WHERE id = ?';
        db.get(sql, [id], (err, product) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.render('edit-product', { product: product });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/edit-product/:id', auth.verifyToken, async (req, res) => {
    try {
        await products.editProduct(req.params.id, req.body);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/delete-product/:id', auth.verifyToken, async (req, res) => {
    try {
        await products.deleteProduct(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/add-product', auth.verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await products.addProduct(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).render('error', { errorMessage: 'Dostęp zabroniony' });
    }
});

app.post('/add-user', auth.verifyToken, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await users.addUser(req.body);
            res.redirect('/dashboard');
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(403).render('error', { errorMessage: 'Dostęp zabroniony' });
    }
});

app.get('/edit-user/:id', auth.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, user) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.render('edit-user', { user: user });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/edit-user/:id', auth.verifyToken, async (req, res) => {
    try {
        await users.editUser(req.params.id, req.body);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/delete-user/:id', async (req, res) => {
    try {
        await users.deleteUser(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
