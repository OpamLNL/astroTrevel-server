const { query } = require('../config/database');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні постів' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const posts = await query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (posts.length === 0) return res.status(404).json({ error: 'Пост не знайдено' });
        res.json(posts[0]);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні поста' });
    }
};

exports.createPost = async (req, res) => {
    const { id, title, content } = req.body;
    try {
        await query('INSERT INTO posts (id, title, content) VALUES (?, ?, ?)', [id, title, content]);
        res.status(201).json({ message: 'Пост створено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при створенні поста' });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    try {
        await query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
        res.json({ message: 'Пост оновлено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при оновленні поста' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Пост видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при видаленні поста' });
    }
};

exports.getTagsByPost = async (req, res) => {
    try {
        const tags = await query(`
      SELECT t.* FROM tags t
      JOIN post_tags pt ON pt.tag_id = t.id
      WHERE pt.post_id = ?
    `, [req.params.id]);
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні тегів поста' });
    }
};

exports.searchContent = async (req, res) => {
    const { query: keyword } = req.query;
    try {
        const results = await query(`
      SELECT 'location' AS type, id, name AS title, description FROM locations WHERE name LIKE ?
      UNION
      SELECT 'tour' AS type, id, title, description FROM tours WHERE title LIKE ?
      UNION
      SELECT 'post' AS type, id, title, content FROM posts WHERE title LIKE ?
    `, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при пошуку' });
    }
};
