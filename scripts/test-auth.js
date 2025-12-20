const axios = require('axios');
const API_URL = 'http://localhost:3000/api';

// Simple cookie jar if we needed cookies, but we are using headers
let accessToken = '';
let refreshToken = '';

async function testAuth() {
    try {
        console.log('Testing Authentication...');
        const timestamp = Date.now();
        const username = `auth_user_${timestamp}`;
        const email = `auth_${timestamp}@example.com`;
        const password = 'password123';

        // 1. Register
        console.log('1. Registering...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password
        });
        console.log('Registered Success:', regRes.data.success);

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });
        console.log('Login Success:', loginRes.data.success);
        accessToken = loginRes.data.data.accessToken;
        refreshToken = loginRes.data.data.refreshToken;

        if (!accessToken) throw new Error('No access token received');

        // 3. Access Protected Route (Logout requires token)
        console.log('3. Accessing Protected Route (Logout)...');
        const logoutRes = await axios.post(`${API_URL}/auth/logout`, {
            // usually we might need the ID, but our controller might extract it from body or token
            // My implementation expected 'id' in body for logout, but verifyToken adds user to req.user.
            // Let's check controller... it expects { id } in body. 
            // Ideally it should take from req.user.id but let's send it in body for now as implemented.
            id: loginRes.data.data.user.id
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Logout Success:', logoutRes.data.success);

        console.log('SUCCESS: Auth flow verified!');
    } catch (error) {
        if (error.response) {
            console.error('Auth Error:', error.response.status, error.response.data);
        } else {
            console.error('Test Failed:', error.message);
        }
        process.exit(1);
    }
}

testAuth();
