const bcrypt = require('bcrypt');
const { User } = require('./models');

async function resetPassword() {
    const email = 'aryanghait123@gmail.com';
    const newPassword = 'Stableaf@123';

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
        console.log('User not found!');
        process.exit(1);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await user.update({ password_hash: newHash });

    console.log(`Password reset for ${email} to: ${newPassword}`);

    // Verify
    const match = await bcrypt.compare(newPassword, newHash);
    console.log(`Verification: ${match ? 'SUCCESS' : 'FAILED'}`);

    process.exit(0);
}

resetPassword();
