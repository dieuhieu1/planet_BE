const axios = require('axios');
const API_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    try {
        const uniqueId = Date.now();
        const username = `user_${uniqueId}`;
        const password = 'password123';

        console.log(`1. Registering user: ${username}`);
        await axios.post(`${API_URL}/register`, {
            id: `user-${uniqueId}`,
            username,
            email: `${username}@example.com`,
            password
        });
        console.log('Registration successful');

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        console.log('Login successful');
        console.log('Tokens:', loginRes.data.data.accessToken ? 'Present' : 'Missing');

    } catch (error) {
        if (error.response) {
            console.error('Auth Error:', error.response.status, error.response.data);
        } else {
            console.error('Test Failed:', error.message);
            console.error(error);
        }
    }
}

testAuth();
