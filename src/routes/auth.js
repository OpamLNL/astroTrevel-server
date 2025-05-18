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

        console.log(users);
        console.log(uid);


        let userId;
        if (users.length === 0) {
            const result = await query(
                'INSERT INTO users (firebase_uid, email, name, avatar_url) VALUES (?, ?, ?, ?)',
                [uid, email, name || '', picture || null]
            );
            userId = result.insertId;
        } else {
            userId = users.id;
            console.log('userId');
            console.log(userId);
        }

        // Отримуємо роль користувача з бази
        const [roleRows] = await query(`
            SELECT r.name AS role
            FROM user_roles ur
                     JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?
                LIMIT 1
        `, [userId]);

        const role = roleRows?.role || 'USER';
        console.log('Роль з БД:', role);




        res.status(200).json({
            success: true,
            firebaseUid: uid,
            role,
            name: users[0]?.name || name || '',
            email: users[0]?.email || email || '',
            avatar_url: users[0]?.avatar_url || picture || ''
        });

    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Невірний токен Firebase' });
    }
});

module.exports = router;
