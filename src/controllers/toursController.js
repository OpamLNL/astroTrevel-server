const { query } = require('../config/database');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await query('SELECT * FROM tours');
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні турів' });
    }
};

exports.getUpcomingTours = async (req, res) => {
    try {
        const tours = await query('SELECT * FROM tours WHERE date >= CURDATE() ORDER BY date');
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні майбутніх турів' });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tours = await query('SELECT * FROM tours WHERE id = ?', [req.params.id]);
        if (tours.length === 0) return res.status(404).json({ error: 'Тур не знайдено' });
        res.json(tours[0]);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні туру' });
    }
};

exports.createTour = async (req, res) => {
    const { id, title, locationId, date, description } = req.body;
    try {
        await query(
            'INSERT INTO tours (id, title, locationId, date, description) VALUES (?, ?, ?, ?, ?)',
            [id, title, locationId, date, description]
        );
        res.status(201).json({ message: 'Тур створено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при створенні туру' });
    }
};

exports.updateTour = async (req, res) => {
    const { title, locationId, date, description } = req.body;
    try {
        await query(
            'UPDATE tours SET title = ?, locationId = ?, date = ?, description = ? WHERE id = ?',
            [title, locationId, date, description, req.params.id]
        );
        res.json({ message: 'Тур оновлено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при оновленні туру' });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await query('DELETE FROM tours WHERE id = ?', [req.params.id]);
        res.json({ message: 'Тур видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при видаленні туру' });
    }
};

exports.getTagsByTour = async (req, res) => {
    try {
        const tags = await query(`
      SELECT t.* FROM tags t
      JOIN tour_tags tt ON tt.tag_id = t.id
      WHERE tt.tour_id = ?
    `, [req.params.id]);
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні тегів туру' });
    }
};
