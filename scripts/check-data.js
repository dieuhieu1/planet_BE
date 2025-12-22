require('dotenv').config();
const db = require('../models');

async function checkData() {
    try {
        console.log('Checking database data...\n');

        // Count planets
        const planetCount = await db.Planet.count();
        console.log(`📊 Total Planets: ${planetCount}`);

        if (planetCount > 0) {
            const planets = await db.Planet.findAll({
                attributes: ['id', 'planetId', 'nameVi', 'nameEn']
            });
            console.log('\n🪐 Planets in database:');
            planets.forEach(p => {
                console.log(`  - ${p.nameEn} (${p.nameVi}) - ID: ${p.id}`);
            });
        }

        // Count other tables
        const moons = await db.Moon.count();
        const events = await db.PlanetEvent.count();
        const physical = await db.PlanetPhysical.count();

        console.log(`\n📊 Other data:`);
        console.log(`  - Moons: ${moons}`);
        console.log(`  - Planet Events: ${events}`);
        console.log(`  - Physical Data: ${physical}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
