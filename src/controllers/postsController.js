const { query } = require('../config/database');

exports.getAllPosts = async (req, res) => {
    const posts = await query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(posts);
};

exports.getPostById = async (req, res) => {
    const [post] = await query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    post ? res.json(post) : res.status(404).json({ error: 'Пост не знайдено' });
};

exports.createPost = async (req, res) => {
    const { id, title, content, image_url } = req.body;
    await query('INSERT INTO posts (id, title, content, image_url) VALUES (?, ?, ?, ?)', [id, title, content, image_url]);
    res.status(201).json({ success: true });
};

exports.updatePost = async (req, res) => {
    const { title, content, image_url } = req.body;
    await query('UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?', [title, content, image_url, req.params.id]);
    res.json({ success: true });
};

exports.deletePost = async (req, res) => {
    await query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
};

exports.getTagsByPost = async (req, res) => {
    const tags = await query(
        `SELECT t.* FROM tags t
     JOIN post_tags pt ON t.id = pt.tag_id
     WHERE pt.post_id = ?`,
        [req.params.id]
    );
    res.json(tags);
};


exports.searchContent = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Параметр q є обовʼязковим для пошуку.' });
    }

    const searchQuery = `%${q}%`;

    const posts = await query(`
    SELECT * FROM posts
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY created_at DESC
  `, [searchQuery, searchQuery]);

    res.json(posts);
};