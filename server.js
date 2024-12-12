const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like HTML, CSS, JS
app.use(
    session({
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: true,
    })
);

// MySQL database setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your MySQL username
    password: '', // Update with your MySQL password
    database: 'uzduotis', // Update with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Routes

// Serve login and register pages
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/register', (req, res) => res.sendFile(__dirname + '/public/register.html'));

// Register a new user
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        console.error('Missing required fields:', { name, email, password });
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error while checking email:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length > 0) {
            console.log('Email already exists:', email);
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error hashing password.' });
            }

            const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Database error while inserting user:', err);
                    return res.status(500).json({ message: 'Error registering user.' });
                }

                console.log('User registered successfully:', result.insertId);
                req.session.userId = result.insertId;
                res.status(201).json({ message: 'User registered successfully.' });
            });
        });
    });
});

// Login an existing user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error checking password:', err);
                return res.status(500).json({ message: 'Error checking password.' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password.' });
            }

            console.log('Login successful for user ID:', user.id);
            req.session.userId = user.id;
            res.json({ message: 'Login successful.' });
        });
    });
});

// Dashboard access
app.get('/api/dashboard', (req, res) => {
    if (!req.session.userId) {
        console.error('Unauthorized access attempt.');
        return res.status(401).json({ message: 'Unauthorized access.' });
    }

    res.json({ message: 'Welcome to your dashboard!' });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Error logging out.' });
        }
        console.log('User logged out successfully.');
        res.json({ message: 'Logged out successfully.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
