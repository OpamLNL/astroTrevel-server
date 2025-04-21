const { query } = require('../config/database');

exports.getAllTags = async (req, res) => {
    try {
        const tags = await query('SELECT * FROM tags ORDER BY name');
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні тегів' });
    }
};

exports.getTagById = async (req, res) => {
    try {
        const tags = await query('SELECT * FROM tags WHERE id = ?', [req.params.id]);
        if (tags.length === 0) return res.status(404).json({ error: 'Тег не знайдено' });
        res.json(tags[0]);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні тегу' });
    }
};

exports.createTag = async (req, res) => {
    const { id, name } = req.body;
    try {
        await query('INSERT INTO tags (id, name) VALUES (?, ?)', [id, name]);
        res.status(201).json({ message: 'Тег створено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при створенні тегу' });
    }
};

exports.updateTag = async (req, res) => {
    const { name } = req.body;
    try {
        await query('UPDATE tags SET name = ? WHERE id = ?', [name, req.params.id]);
        res.json({ message: 'Тег оновлено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при оновленні тегу' });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        await query('DELETE FROM tags WHERE id = ?', [req.params.id]);
        res.json({ message: 'Тег видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при видаленні тегу' });
    }
};

exports.getLocationsByTag = async (req, res) => {
    try {
        const locations = await query(`
            SELECT l.* FROM locations l
                                JOIN location_tags lt ON lt.location_id = l.id
            WHERE lt.tag_id = ?
        `, [req.params.id]);
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні локацій по тегу' });
    }
};

exports.getToursByTag = async (req, res) => {
    try {
        const tours = await query(`
            SELECT t.* FROM tours t
                                JOIN tour_tags tt ON tt.tour_id = t.id
            WHERE tt.tag_id = ?
        `, [req.params.id]);
        res.json(tours);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні турів по тегу' });
    }
};

exports.getPostsByTag = async (req, res) => {
    try {
        const posts = await query(`
            SELECT p.* FROM posts p
                                JOIN post_tags pt ON pt.post_id = p.id
            WHERE pt.tag_id = ?
        `, [req.params.id]);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні постів по тегу' });
    }
};

exports.filterByTag = async (req, res) => {
    const { tag, type } = req.query;
    try {
        let results = [];
        switch (type) {
            case 'location':
                results = await query(`
                    SELECT l.* FROM locations l
                                        JOIN location_tags lt ON lt.location_id = l.id
                                        JOIN tags t ON t.id = lt.tag_id
                    WHERE t.name = ?
                `, [tag]);
                break;
            case 'tour':
                results = await query(`
                    SELECT t.* FROM tours t
                                        JOIN tour_tags tt ON tt.tour_id = t.id
                                        JOIN tags tg ON tg.id = tt.tag_id
                    WHERE tg.name = ?
                `, [tag]);
                break;
            case 'post':
                results = await query(`
                    SELECT p.* FROM posts p
                                        JOIN post_tags pt ON pt.post_id = p.id
                                        JOIN tags tg ON tg.id = pt.tag_id
                    WHERE tg.name = ?
                `, [tag]);
                break;
            default:
                return res.status(400).json({ error: 'Невідомий тип для фільтрації' });
        }
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при фільтрації по тегу' });
    }
};
