const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
}

const updates = {
    'SMTP_HOST': 'smtp.gmail.com',
    'SMTP_PORT': '587',
    'SMTP_USER': 'aryanghait123@gmail.com',
    'SMTP_PASS': 'atiw nxlt xzmk tjvz',
    'ADMIN_EMAIL': 'aryanghait123@gmail.com',
    'SMTP_SECURE': 'false'
};

let lines = envContent.split('\n');
for (const [key, value] of Object.entries(updates)) {
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith(key + '=')) {
            lines[i] = `${key}=${value}`;
            found = true;
            break;
        }
    }
    if (!found) {
        lines.push(`${key}=${value}`);
    }
}

fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
console.log('Updated .env successfully');
