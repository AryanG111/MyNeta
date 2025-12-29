# My Neta Backend

Environment variables:

```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=myneta
DB_DIALECT=mysql

JWT_SECRET=change-me
BCRYPT_ROUNDS=10

# base64 of 32 random bytes
DATA_ENC_KEY=

IP_SALT=change-me
```

Run:

```
npm install
npx sequelize-cli db:migrate
npm run dev
```

