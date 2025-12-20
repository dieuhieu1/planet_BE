require('dotenv').config();
const db = require('../models');

async function sync() {
    try {
        console.log('Altering database schema...');
        // alter: true updates tables to match models without dropping them (preserves data if possible)
        await db.sequelize.sync({ alter: true });
        console.log('Database synced successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

sync();
