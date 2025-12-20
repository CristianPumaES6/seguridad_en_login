
import axios from 'axios';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as path from 'path';

const API_URL = 'http://localhost:3000/api/v1';

async function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verify() {
    console.log('🚀 Starting Verification on Running Server...');

    // 1. Wait for Server
    let attempts = 0;
    let serverReady = false;
    console.log('⏳ Waiting for server to be ready on port 3000...');

    while (attempts < 60) {
        try {
            await axios.get(`${API_URL}/users`);
            serverReady = true;
            break;
        } catch (e) {
            // 401 means server is responding but we are unauthorized -> Good!
            if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                serverReady = true;
                break;
            }
            // Connection refused means not ready
        }
        await wait(1000);
        process.stdout.write('.');
        attempts++;
    }
    console.log('\n');

    if (!serverReady) {
        console.error('❌ Timeout waiting for server.');
        process.exit(1);
    }

    console.log('✅ Server is detected!');

    try {
        const time = Date.now();
        // 2. Register User
        const email = `verify_${time}@test.com`;
        console.log(`\n👤 Registering user: ${email}`);
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Verifier',
            email,
            password: 'StrongPassword123!'
        });
        console.log('✅ Registration Successful');

        // 3. Login
        console.log('🔑 Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password: 'StrongPassword123!'
        });
        const token = loginRes.data.access_token;
        console.log('✅ Login Successful. Token received.');

        // 4. Get Profile (Audit Trigger)
        console.log('📂 Fetching Profile (Triggering Audit)...');
        await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile Fetched');

        // 5. Verify Database Audit Log
        console.log('\n🕵️ Verifying Database Audit Logs in database.sqlite...');
        const db = await open({
            filename: path.join(process.cwd(), 'database.sqlite'),
            driver: sqlite3.Database
        });

        const logs = await db.all('SELECT * FROM user_queries ORDER BY id DESC LIMIT 5');
        console.log(`Found ${logs.length} recently logs.`);

        // Look for our specific action (Profile View)
        const profileLog = logs.find(l => l.endpoint.includes('/profile') && l.action_type === 'PROFILE_VIEW');

        if (profileLog) {
            console.log('✅ AUDIT VERIFIED: Found PROFILE_VIEW log entry.');
            console.log('   Create Time:', profileLog.created_at);
            console.log('   IP Address:', profileLog.ip_address);
            console.log('   Method:', profileLog.method);
        } else {
            console.error('❌ AUDIT FAILED: Could not find profiling log entry.');
            console.log('Recent logs:', logs);
        }

        await db.close();

    } catch (err) {
        console.error('❌ Verification Step Failed:', err.message);
        if (err.response) {
            console.error('   Response Data:', err.response.data);
        }
        process.exit(1);
    }
}

verify();
