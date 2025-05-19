const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function dropTables() {
    console.log('🧨 Dropping existing tables...');
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query(`
        DROP TABLE IF EXISTS
            visit_later_tours,
            visit_later_locations,
            favorites,
            likes,
            post_tags,
            tour_tags,
            location_tags,
            tour_locations,
            tags,
            posts,
            tours,
            locations,
            user_roles,
            roles,
            users
    `);
    await query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Tables dropped.');
}

async function createTables() {
    console.log('📦 Creating tables...');

    await query(`CREATE TABLE IF NOT EXISTS users (
                                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                                      firebase_uid VARCHAR(128) NOT NULL UNIQUE,
        email VARCHAR(255),
        name VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);


    await query(`CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) `);




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
        date DATE,
        description TEXT
        )`);




    await query(`CREATE TABLE IF NOT EXISTS roles (
                                                      id INT AUTO_INCREMENT PRIMARY KEY,
                                                      name VARCHAR(50) NOT NULL UNIQUE
        )`);

    await query(`CREATE TABLE IF NOT EXISTS user_roles (
                                                           user_id INT NOT NULL,
                                                           role_id INT NOT NULL,
                                                           PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        )`);

    await query(`CREATE TABLE IF NOT EXISTS likes (
                                                      user_id INT,
                                                      post_id INT,
                                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                      PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        )`);

    await query(`CREATE TABLE IF NOT EXISTS favorites (
                                                          user_id INT,
                                                          post_id INT,
                                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                          PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        )`);

    await query(`CREATE TABLE IF NOT EXISTS visit_later_locations (
                                                                      user_id INT,
                                                                      location_id INT,
                                                                      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                                      PRIMARY KEY (user_id, location_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
        )`);

    await query(`CREATE TABLE IF NOT EXISTS visit_later_tours (
                                                                  user_id INT,
                                                                  tour_id INT,
                                                                  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                                  PRIMARY KEY (user_id, tour_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
        )`);
    await query(`CREATE TABLE IF NOT EXISTS tour_locations (
                                                               tour_id INT NOT NULL,
                                                               location_id INT NOT NULL,
                                                               PRIMARY KEY (tour_id, location_id),
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
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

    const filteredItems = tableName === 'tours'
        ? items.map(({ locationId, ...rest }) => rest)
        : items;

    for (const item of filteredItems) {
        const keys = Object.keys(item);
        const values = Object.values(item);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
        await query(sql, values);
    }

    console.log(`✅ Inserted data into '${tableName}' (${items.length} records).`);
    return items;
}

async function createTourLocationRelations(toursData) {
    console.log('🔗 Creating tour_locations...');
    for (const tour of toursData) {
        if (!tour.locationId) continue;
        const locationIds = Array.isArray(tour.locationId) ? tour.locationId : [tour.locationId];
        for (const locId of locationIds) {
            await query(
                `INSERT INTO tour_locations (tour_id, location_id) VALUES (?, ?)`,
                [tour.id, locId]
            );
            console.log(`🔗 Linked tour ${tour.id} with location ${locId}`);
        }
    }
    console.log('✅ tour_locations created.');
}

async function init() {
    try {
        await dropTables();
        await createTables();

        await loadData('locations', 'locations.json');
        const toursData = await loadData('tours', 'tours.json');
        await createTourLocationRelations(toursData);
        await loadData('posts', 'posts.json');
        await loadData('tags', 'tags.json');

        await loadData('roles', 'roles.json');
        await loadData('users', 'users.json');
        await loadData('user_roles', 'user_roles.json');

        await loadData('location_tags', 'location_tags.json');
        await loadData('tour_tags', 'tour_tags.json');
        await loadData('post_tags', 'post_tags.json');

        await loadData('likes', 'likes.json');
        await loadData('favorites', 'favorites.json');
        await loadData('visit_later_locations', 'visit_later_locations.json');
        await loadData('visit_later_tours', 'visit_later_tours.json');



        console.log('🚀 Database initialized successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during database initialization:', err);
        process.exit(1);
    }
}


module.exports = init;
if (require.main === module) init();
