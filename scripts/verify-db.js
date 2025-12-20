require('dotenv').config();
const db = require('../models');

async function verify() {
    try {
        console.log('Syncing database...');
        // Force true drops tables if they exist
        await db.sequelize.sync({ force: true });
        console.log('Database synced!');

        console.log('Creating Level...');
        await db.Level.create({
            level: 1,
            minXp: 0,
            rankName: 'Novice',
            iconUrl: 'http://example.com/icon.png'
        });

        console.log('Creating User...');
        const user = await db.User.create({
            id: 'user-1',
            username: 'testuser',
            email: 'test@example.com',
            level: 1, // references Level 1
            totalXp: 0
        });

        console.log('Creating Planet...');
        const planet = await db.Planet.create({
            id: 'planet-1',
            planetId: 'mars',
            nameVi: 'Sao Hỏa',
            nameEn: 'Mars',
            type: 'Terrestrial',
            hasAtmosphere: true,
            createdAt: new Date()
        });

        console.log('Creating Planet Physical data...');
        await db.PlanetPhysical.create({
            planetId: 'planet-1',
            gravity: 3.7
        });

        console.log('Creating Quiz...');
        const quiz = await db.Quiz.create({
            id: 'quiz-1',
            planetId: 'planet-1',
            creatorId: 'user-1',
            title: 'Mars Basics',
            minLevel: 1
        });

        console.log('Verifying Relationships...');

        // Check Planet -> Physical
        const p = await db.Planet.findOne({
            where: { id: 'planet-1' },
            include: ['physical', 'quizzes']
        });

        if (!p) throw new Error('Planet not found');
        if (!p.physical) throw new Error('Planet physical data missing');
        if (p.physical.gravity !== 3.7) throw new Error('Planet gravity mismatch');
        if (p.quizzes.length !== 1) throw new Error('Planet quiz count mismatch');

        console.log('SUCCESS: All checks passed!');
        process.exit(0);
    } catch (error) {
        console.error('Verification FAILED:', error);
        process.exit(1);
    }
}

verify();
