const { query } = require('../config/database');
const init = require('../migrations/init-db');

const REQUIRED_TABLES = [
    'locations',
    'tours',
    'tags',
    'location_tags',
    'tour_tags',
    'posts',
    'post_tags'
];

async function checkAndInitDatabase() {
    try {
        const rows = await query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = ?
    `, [process.env.DB_DATABASE]);

        const existingTables = rows.map(r => r.TABLE_NAME || r.table_name);
        const missingTables = REQUIRED_TABLES.filter(t => !existingTables.includes(t));

        if (missingTables.length > 0) {
            console.log(`🧱 Missing tables: ${missingTables.join(', ')} — initializing...`);
            await init();
        } else {
            console.log('✅ All required tables exist.');
        }
    } catch (err) {
        console.error('❌ Error during DB check:', err);
        throw err;
    }
}

module.exports = { checkAndInitDatabase };
