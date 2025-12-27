require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  dataEncKeyB64: process.env.DATA_ENC_KEY || '',
  ipSalt: process.env.IP_SALT || '',
  db: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'myneta',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: process.env.DB_DIALECT || 'sqlite'
  }
};

// Validate mandatory config
if (!config.jwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is required. Set it in .env file.');
}

module.exports = config;
