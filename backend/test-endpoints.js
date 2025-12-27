// Comprehensive API endpoint test script
const http = require('http');

const API_BASE = 'http://localhost:5000/api';

async function makeRequest(method, path, token = null, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    const results = [];

    console.log('=== MyNeta API Endpoint Testing ===\n');

    // Test 1: Health check
    console.log('1. Testing /api/health...');
    const health = await makeRequest('GET', '/health');
    results.push({ endpoint: 'GET /api/health', status: health.status, ok: health.status === 200 });
    console.log(`   Status: ${health.status} - ${health.data.status || 'N/A'}`);

    // Test 2: Login
    console.log('\n2. Testing POST /api/auth/login...');
    const login = await makeRequest('POST', '/auth/login', null, {
        identifier: 'subhash@myneta.app',
        password: 'Vedish0101'
    });
    results.push({ endpoint: 'POST /api/auth/login', status: login.status, ok: login.status === 200 });
    console.log(`   Status: ${login.status} - ${login.data.token ? 'Token received' : login.data.message}`);

    const token = login.data.token;
    if (!token) {
        console.log('\nFailed to get token. Cannot test protected endpoints.');
        return results;
    }

    // Test 3: Register (no validation per user request)
    console.log('\n3. Testing POST /api/auth/register...');
    const register = await makeRequest('POST', '/auth/register', null, {
        name: 'Test User',
        email: 'test@test.com',
        password: 'testpassword123',
        mobile: '1234567890',
        role: 'voter'
    });
    results.push({ endpoint: 'POST /api/auth/register', status: register.status, ok: register.status === 201 || register.status === 409 });
    console.log(`   Status: ${register.status} - ${register.data.message || 'User registered'}`);

    // Test 4: Get voters
    console.log('\n4. Testing GET /api/voters...');
    const voters = await makeRequest('GET', '/voters', token);
    results.push({ endpoint: 'GET /api/voters', status: voters.status, ok: voters.status === 200 });
    console.log(`   Status: ${voters.status} - ${Array.isArray(voters.data.data) ? voters.data.data.length + ' voters' : voters.data.message}`);

    // Test 5: Get voter counts
    console.log('\n5. Testing GET /api/voters/counts...');
    const voterCounts = await makeRequest('GET', '/voters/counts', token);
    results.push({ endpoint: 'GET /api/voters/counts', status: voterCounts.status, ok: voterCounts.status === 200 });
    console.log(`   Status: ${voterCounts.status}`);

    // Test 6: Create voter
    console.log('\n6. Testing POST /api/voters...');
    const createVoter = await makeRequest('POST', '/voters', token, {
        name: 'Test Voter',
        address: 'Test Address 123',
        booth: 'Booth 1',
        phone: '9876543210',
        category: 'supporter'
    });
    results.push({ endpoint: 'POST /api/voters', status: createVoter.status, ok: createVoter.status === 201 });
    console.log(`   Status: ${createVoter.status} - ${createVoter.data.id ? 'Voter ID: ' + createVoter.data.id : createVoter.data.message}`);
    const voterId = createVoter.data.id;

    // Test 7: Get complaints
    console.log('\n7. Testing GET /api/complaints...');
    const complaints = await makeRequest('GET', '/complaints', token);
    results.push({ endpoint: 'GET /api/complaints', status: complaints.status, ok: complaints.status === 200 });
    console.log(`   Status: ${complaints.status} - ${Array.isArray(complaints.data) ? complaints.data.length + ' complaints' : complaints.data.message}`);

    // Test 8: Create complaint
    console.log('\n8. Testing POST /api/complaints...');
    const createComplaint = await makeRequest('POST', '/complaints', token, {
        voter_id: voterId || 1,
        issue: 'Test complaint issue',
        status: 'pending'
    });
    results.push({ endpoint: 'POST /api/complaints', status: createComplaint.status, ok: createComplaint.status === 201 });
    console.log(`   Status: ${createComplaint.status} - ${createComplaint.data.id ? 'Complaint ID: ' + createComplaint.data.id : createComplaint.data.message}`);
    const complaintId = createComplaint.data.id;

    // Test 9: Update complaint status
    if (complaintId) {
        console.log('\n9. Testing PATCH /api/complaints/:id/status...');
        const updateComplaint = await makeRequest('PATCH', `/complaints/${complaintId}/status`, token, {
            status: 'in_progress'
        });
        results.push({ endpoint: 'PATCH /api/complaints/:id/status', status: updateComplaint.status, ok: updateComplaint.status === 200 });
        console.log(`   Status: ${updateComplaint.status}`);
    }

    // Test 10: Get events
    console.log('\n10. Testing GET /api/events...');
    const events = await makeRequest('GET', '/events', token);
    results.push({ endpoint: 'GET /api/events', status: events.status, ok: events.status === 200 });
    console.log(`   Status: ${events.status} - ${Array.isArray(events.data) ? events.data.length + ' events' : events.data.message}`);

    // Test 11: Create event
    console.log('\n11. Testing POST /api/events...');
    const createEvent = await makeRequest('POST', '/events', token, {
        title: 'Test Event',
        description: 'Test event description',
        event_date: '2025-01-15',
        location: 'Test Location'
    });
    results.push({ endpoint: 'POST /api/events', status: createEvent.status, ok: createEvent.status === 201 });
    console.log(`   Status: ${createEvent.status} - ${createEvent.data.id ? 'Event ID: ' + createEvent.data.id : createEvent.data.message}`);
    const eventId = createEvent.data.id;

    // Test 12: Update event
    if (eventId) {
        console.log('\n12. Testing PUT /api/events/:id...');
        const updateEvent = await makeRequest('PUT', `/events/${eventId}`, token, {
            title: 'Updated Test Event',
            description: 'Updated description',
            event_date: '2025-01-20',
            location: 'Updated Location'
        });
        results.push({ endpoint: 'PUT /api/events/:id', status: updateEvent.status, ok: updateEvent.status === 200 });
        console.log(`   Status: ${updateEvent.status}`);
    }

    // Test 13: Get volunteers
    console.log('\n13. Testing GET /api/volunteers...');
    const volunteers = await makeRequest('GET', '/volunteers', token);
    results.push({ endpoint: 'GET /api/volunteers', status: volunteers.status, ok: volunteers.status === 200 });
    console.log(`   Status: ${volunteers.status}`);

    // Test 14: Admin volunteer requests
    console.log('\n14. Testing GET /api/admin/volunteer-requests...');
    const volunteerRequests = await makeRequest('GET', '/admin/volunteer-requests', token);
    results.push({ endpoint: 'GET /api/admin/volunteer-requests', status: volunteerRequests.status, ok: volunteerRequests.status === 200 });
    console.log(`   Status: ${volunteerRequests.status}`);

    // Test 15: Update voter
    if (voterId) {
        console.log('\n15. Testing PUT /api/voters/:id...');
        const updateVoter = await makeRequest('PUT', `/voters/${voterId}`, token, {
            name: 'Updated Test Voter',
            address: 'Updated Address',
            booth: 'Booth 2',
            phone: '1111111111',
            category: 'neutral'
        });
        results.push({ endpoint: 'PUT /api/voters/:id', status: updateVoter.status, ok: updateVoter.status === 200 });
        console.log(`   Status: ${updateVoter.status}`);
    }

    // Test 16: Delete voter
    if (voterId) {
        console.log('\n16. Testing DELETE /api/voters/:id...');
        const deleteVoter = await makeRequest('DELETE', `/voters/${voterId}`, token);
        results.push({ endpoint: 'DELETE /api/voters/:id', status: deleteVoter.status, ok: deleteVoter.status === 200 });
        console.log(`   Status: ${deleteVoter.status}`);
    }

    // Test 17: Delete complaint
    if (complaintId) {
        console.log('\n17. Testing DELETE /api/complaints/:id...');
        const deleteComplaint = await makeRequest('DELETE', `/complaints/${complaintId}`, token);
        results.push({ endpoint: 'DELETE /api/complaints/:id', status: deleteComplaint.status, ok: deleteComplaint.status === 200 });
        console.log(`   Status: ${deleteComplaint.status}`);
    }

    // Test 18: Delete event
    if (eventId) {
        console.log('\n18. Testing DELETE /api/events/:id...');
        const deleteEvent = await makeRequest('DELETE', `/events/${eventId}`, token);
        results.push({ endpoint: 'DELETE /api/events/:id', status: deleteEvent.status, ok: deleteEvent.status === 200 });
        console.log(`   Status: ${deleteEvent.status}`);
    }

    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const passed = results.filter(r => r.ok).length;
    const failed = results.filter(r => !r.ok).length;
    console.log(`Passed: ${passed}/${results.length}`);
    console.log(`Failed: ${failed}/${results.length}`);

    if (failed > 0) {
        console.log('\nFailed endpoints:');
        results.filter(r => !r.ok).forEach(r => {
            console.log(`  - ${r.endpoint} (Status: ${r.status})`);
        });
    }

    return results;
}

runTests().catch(console.error);
