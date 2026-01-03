// Test email sending directly
const { notifyVoterApproved, notifyVolunteerApproved } = require('./src/emailService');

async function testEmails() {
    const testEmail = 'aryanghait123@gmail.com'; // Send to yourself for testing

    console.log('=== TESTING APPROVAL EMAILS ===');
    console.log(`Target email: ${testEmail}`);
    console.log('');

    console.log('1. Testing Voter Approval Email...');
    try {
        const result1 = await notifyVoterApproved('Test Voter', testEmail);
        console.log('   Result:', result1);
    } catch (err) {
        console.error('   ERROR:', err.message);
    }

    console.log('');
    console.log('2. Testing Volunteer Approval Email...');
    try {
        const result2 = await notifyVolunteerApproved('Test Volunteer', testEmail);
        console.log('   Result:', result2);
    } catch (err) {
        console.error('   ERROR:', err.message);
    }

    console.log('');
    console.log('=== TEST COMPLETE ===');
    process.exit(0);
}

testEmails();
