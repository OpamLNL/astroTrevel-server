const { query } = require('../config/database');

exports.getFavoritePosts = async (req, res) => {
    const rows = await query('SELECT post_id FROM favorites WHERE user_id = ?', [req.params.userId]);
    res.json(rows.map(r => r.post_id));
};

exports.getPlannedLocations = async (req, res) => {
    const rows = await query('SELECT location_id FROM visit_later_locations WHERE user_id = ?', [req.params.userId]);
    res.json(rows.map(r => r.location_id));
};

exports.getPlannedTours = async (req, res) => {
    const rows = await query('SELECT tour_id FROM visit_later_tours WHERE user_id = ?', [req.params.userId]);
    res.json(rows.map(r => r.tour_id));
};


exports.addFavoritePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    await query('INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)', [user_id, post_id]);
    res.status(201).json({ success: true });
};

exports.removeFavoritePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    await query('DELETE FROM favorites WHERE user_id = ? AND post_id = ?', [user_id, post_id]);
    res.json({ success: true });
};

exports.addPlannedLocation = async (req, res) => {
    const { user_id, location_id } = req.body;
    await query('INSERT IGNORE INTO visit_later_locations (user_id, location_id) VALUES (?, ?)', [user_id, location_id]);
    res.status(201).json({ success: true });
};

exports.removePlannedLocation = async (req, res) => {
    const { user_id, location_id } = req.body;
    await query('DELETE FROM visit_later_locations WHERE user_id = ? AND location_id = ?', [user_id, location_id]);
    res.json({ success: true });
};


exports.addPlannedTour = async (req, res) => {
    const { user_id, tour_id } = req.body;
    await query('INSERT IGNORE INTO visit_later_tours (user_id, tour_id) VALUES (?, ?)', [user_id, tour_id]);
    res.status(201).json({ success: true });
};

exports.removePlannedTour = async (req, res) => {
    const { user_id, tour_id } = req.body;
    await query('DELETE FROM visit_later_tours WHERE user_id = ? AND tour_id = ?', [user_id, tour_id]);
    res.json({ success: true });
};
