// init-db.js
const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function dropTables() {
    console.log('🧨 Dropping existing tables...');
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('DROP TABLE IF EXISTS post_tags, tour_tags, location_tags, tags, posts, tours, locations');
    await query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Tables dropped.');
}

async function createTables() {
    console.log('📦 Creating tables...');

    await query(`CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    photoUrl VARCHAR(255)
  )`);

    await query(`CREATE TABLE IF NOT EXISTS tours (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    locationId INT,
    date DATE,
    description TEXT,
    FOREIGN KEY (locationId) REFERENCES locations(id)
  )`);

    await query(`CREATE TABLE IF NOT EXISTS posts (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

    await query(`CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
  )`);

    await query(`CREATE TABLE IF NOT EXISTS location_tags (
    location_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (location_id, tag_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  )`);

    await query(`CREATE TABLE IF NOT EXISTS tour_tags (
    tour_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (tour_id, tag_id),
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  )`);

    await query(`CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  )`);

    console.log('✅ Tables created successfully.');
}

async function loadData(tableName, jsonFile) {
    const dataPath = path.join(__dirname, '../seed', jsonFile);
    const rawData = fs.readFileSync(dataPath);
    const items = JSON.parse(rawData);

    for (const item of items) {
        const keys = Object.keys(item);
        const values = Object.values(item);

        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

        await query(sql, values);
    }

    console.log(`✅ Inserted data into '${tableName}' (${items.length} records).`);
}

async function init() {
    try {
        await dropTables();
        await createTables();
        await loadData('locations', 'locations.json');
        await loadData('tours', 'tours.json');
        await loadData('posts', 'posts.json');
        await loadData('tags', 'tags.json');
        await loadData('location_tags', 'location_tags.json');
        await loadData('tour_tags', 'tour_tags.json');
        await loadData('post_tags', 'post_tags.json');
        console.log('🚀 Database initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during database initialization:', err);
        process.exit(1);
    }
}

module.exports = init;

if (require.main === module) {
    init();
}
