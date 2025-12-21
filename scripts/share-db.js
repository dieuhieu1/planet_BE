const { exec } = require('child_process');
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USERNAME || 'postgres';
const DB_PASS = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'planet_web_development';
const DUMP_FILE = 'scripts/dump.sql';

const command = process.argv[2];

const exportDb = () => {
    console.log('📦 Exporting database...');
    // Set PGPASSWORD env var for the command to avoid password prompt
    const env = { ...process.env, PGPASSWORD: DB_PASS };

    // pg_dump -U username -h host -d dbname -f output.sql
    const cmd = `pg_dump -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -f ${DUMP_FILE} --clean --if-exists`;

    exec(cmd, { env }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Export error: ${error.message}`);
            return;
        }
        console.log(`✅ Database exported to ${DUMP_FILE}`);
        console.log('👉 Commit this file to Git so others can pull it.');
    });
};

const importDb = () => {
    console.log('📥 Importing database...');
    const env = { ...process.env, PGPASSWORD: DB_PASS };

    // psql -U username -h host -d dbname -f input.sql
    const cmd = `psql -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -f ${DUMP_FILE}`;

    exec(cmd, { env }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Import error: ${error.message}`);
            return;
        }
        console.log(`✅ Database imported from ${DUMP_FILE}`);
    });
};

if (command === 'export') {
    exportDb();
} else if (command === 'import') {
    importDb();
} else {
    console.log('Usage: node scripts/share-db.js [export|import]');
}
