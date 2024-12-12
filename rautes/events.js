const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Gauti renginio detales (visiems prisijungusiems vartotojams)
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM events WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        if (results.length === 0) return res.status(404).json({ message: 'Renginys nerastas' });
        res.status(200).json(results[0]);
    });
});


// Pridėti renginį
router.post('/add', (req, res) => {
    const { title, category, date, location, image } = req.body;
    const query = 'INSERT INTO events (title, category, date, location, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, category, date, location, image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Renginys pridėtas sėkmingai!' });
    });
});

// Filtruoti renginius pagal kategoriją ir datą
router.get('/filter', (req, res) => {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// Vertinti renginį
router.post('/rate/:id', (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Įvertinimas turi būti tarp 1 ir 5.' });
    }

    const query = `
        UPDATE events 
        SET rating = (rating * votes + ?) / (votes + 1), votes = votes + 1 
        WHERE id = ?`;
    db.query(query, [rating, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Renginys nerastas' });
        res.status(200).json({ message: 'Renginys sėkmingai įvertintas!' });
    });
});

router.get('/', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Nepavyko gauti renginių' });
        res.status(200).json(results);
    });
});



// Pridėti naują renginį (tik administratoriams)
router.post('/add', verifyToken, verifyAdmin, (req, res) => {
    const { title, category, date, location, image } = req.body;
    const query = 'INSERT INTO events (title, category, date, location, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, category, date, location, image], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(201).json({ message: 'Renginys pridėtas sėkmingai!' });
    });
});

// Atnaujinti renginį (tik administratoriams)
router.put('/update/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { title, category, date, location, image } = req.body;
    const query = 'UPDATE events SET title = ?, category = ?, date = ?, location = ?, image = ? WHERE id = ?';
    db.query(query, [title, category, date, location, image, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(200).json({ message: 'Renginys atnaujintas sėkmingai!' });
    });
});

// Ištrinti renginį (tik administratoriams)
router.delete('/delete/:id', verifyToken, verifyAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Serverio klaida' });
        res.status(200).json({ message: 'Renginys ištrintas sėkmingai!' });
    });
});

module.exports = router;
