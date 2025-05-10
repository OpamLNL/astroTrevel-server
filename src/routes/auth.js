const express = require('express');
const router = express.Router();
const admin = require('../../firebase-admin');
const { query } = require('../config/database');

router.post('/firebase', async (req, res) => {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');

    try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decoded;

        // Перевірка, чи існує користувач
        const [users] = await query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);

        if (users.length === 0) {
            // Додаємо нового
            await query(
                'INSERT INTO users (firebase_uid, email, name, avatar_url) VALUES (?, ?, ?, ?)',
                [uid, email, name || '', picture || null]
            );
        }

        res.status(200).json({ success: true, firebaseUid: uid });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Невірний токен Firebase' });
    }
});

module.exports = router;
