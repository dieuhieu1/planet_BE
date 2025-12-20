const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

async function testApi() {
    try {
        console.log('Testing APIs...');

        // 1. Create User
        console.log('1. Creating User...');
        const userRes = await axios.post(`${API_URL}/users`, {
            id: 'user-' + Date.now(),
            username: 'testuser_api',
            email: 'valid@email.com',
            level: 1,
            totalXp: 0
        });
        console.log('User created:', userRes.data.success);
        const userId = userRes.data.data.id;

        // 2. Create Planet
        console.log('2. Creating Planet...');
        const planetRes = await axios.post(`${API_URL}/planets`, {
            id: 'planet-' + Date.now(),
            planetId: 'test-planet-' + Date.now(),
            nameVi: 'Test Planet',
            nameEn: 'Test Planet',
            type: 'Test',
            hasAtmosphere: false,
            createdAt: new Date()
        });
        console.log('Planet created:', planetRes.data.success);
        const planetId = planetRes.data.data.id;

        // 3. Create Quiz
        console.log('3. Creating Quiz...');
        const quizRes = await axios.post(`${API_URL}/quizzes`, {
            id: 'quiz-' + Date.now(),
            planetId: planetId,
            creatorId: userId,
            title: 'Test Quiz',
            minLevel: 1,
            rewardXp: 100
        });
        console.log('Quiz created:', quizRes.data.success);

        // 4. List Quizzes
        console.log('4. Listing Quizzes...');
        const listRes = await axios.get(`${API_URL}/quizzes/planet/${planetId}`);
        if (listRes.data.data.length > 0) {
            console.log('Quizzes found:', listRes.data.data.length);
        } else {
            throw new Error('No quizzes found');
        }

        console.log('SUCCESS: All API tests passed!');
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else {
            console.error('Test Failed:', error.message);
        }
        process.exit(1);
    }
}

testApi();
