const { query } = require('../config/database');

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await query('SELECT * FROM locations');
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні локацій' });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const locations = await query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
        if (locations.length === 0) return res.status(404).json({ error: 'Локацію не знайдено' });
        res.json(locations[0]);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні локації' });
    }
};

exports.createLocation = async (req, res) => {
    const { id, name, description, latitude, longitude, photoUrl } = req.body;
    try {
        await query(
            'INSERT INTO locations (id, name, description, latitude, longitude, photoUrl) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, description, latitude, longitude, photoUrl]
        );
        res.status(201).json({ message: 'Локацію створено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при створенні локації' });
    }
};

exports.updateLocation = async (req, res) => {
    const { name, description, latitude, longitude, photoUrl } = req.body;
    try {
        await query(
            'UPDATE locations SET name = ?, description = ?, latitude = ?, longitude = ?, photoUrl = ? WHERE id = ?',
            [name, description, latitude, longitude, photoUrl, req.params.id]
        );
        res.json({ message: 'Локацію оновлено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при оновленні локації' });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        await query('DELETE FROM locations WHERE id = ?', [req.params.id]);
        res.json({ message: 'Локацію видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при видаленні локації' });
    }
};

exports.getToursByLocation = async (req, res) => {
    try {
        const tours = await query('SELECT * FROM tours WHERE locationId = ?', [req.params.id]);
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні турів' });
    }
};

exports.getTagsByLocation = async (req, res) => {
    try {
        const tags = await query(`
      SELECT t.* FROM tags t
      JOIN location_tags lt ON lt.tag_id = t.id
      WHERE lt.location_id = ?
    `, [req.params.id]);
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні тегів локації' });
    }
};
