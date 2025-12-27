// Test script to debug login issue
const { User } = require('./models');

async function testLogin() {
    try {
        console.log('Attempting to find user...');
        const user = await User.findOne({ where: { email: 'subhash@myneta.app' } });
        if (user) {
            console.log('User found:', user.toJSON());
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Full error:', error);
    }
}

testLogin();
