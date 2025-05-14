const { query } = require('../config/database');

// --- Основні операції з постами ---
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
    const tags = await query(`
        SELECT t.* FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
    `, [req.params.id]);
    res.json(tags);
};

// --- Пошук ---
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

// --- Лайки ---
exports.getLikesCount = async (req, res) => {
    const postId = req.params.id;
    try {
        const [row] = await query('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?', [postId]);
        res.json({ count: row.count });
    } catch (err) {
        console.error('Error fetching likes count:', err);
        res.status(500).json({ error: 'Помилка підрахунку лайків' });
    }
};

exports.likePost = async (req, res) => {
    const { uid } = req.body;
    const postId = req.params.id;


    console.log(postId, uid);
    const [user] = await query('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    await query('INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)', [user.id, postId]);
    res.json({ success: true });
};

exports.unlikePost = async (req, res) => {
    const { uid } = req.body;
    const postId = req.params.id;

    const [user] = await query('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    await query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [user.id, postId]);
    res.json({ success: true });
};

// --- Улюблене ---
exports.addToFavorites = async (req, res) => {
    // const { uid } = req.body;
    const { uid } = req.user.uid;
    const postId = req.params.id;

    const [user] = await query('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    await query('INSERT IGNORE INTO favorites (user_id, post_id) VALUES (?, ?)', [user.id, postId]);
    res.json({ success: true });
};

exports.removeFromFavorites = async (req, res) => {
    const { uid } = req.body;
    const postId = req.params.id;

    const [user] = await query('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
    if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });

    await query('DELETE FROM favorites WHERE user_id = ? AND post_id = ?', [user.id, postId]);
    res.json({ success: true });
};

// --- Статус поста для користувача (лайк, улюблене) ---
exports.getUserPostStatus = async (req, res) => {
    const postId = req.params.id;
    const uid = req.query.uid;

    const [user] = await query('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
    if (!user) return res.json({ liked: false, favorited: false });

    const [[liked]] = await query('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?', [user.id, postId]);
    const [[fav]] = await query('SELECT 1 FROM favorites WHERE user_id = ? AND post_id = ?', [user.id, postId]);

    res.json({
        liked: Boolean(liked),
        favorited: Boolean(fav)
    });
};
