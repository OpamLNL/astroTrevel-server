const { query } = require('../config/database');

exports.getUserLikes = async (req, res) => {
    const rows = await query('SELECT post_id FROM likes WHERE user_id = ?', [req.params.userId]);
    res.json(rows.map(r => r.post_id));
};

exports.likePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    await query('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)', [user_id, post_id]);
    res.status(201).json({ success: true });
};

exports.unlikePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    await query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);
    res.json({ success: true });
};
