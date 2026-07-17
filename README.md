# ShopEasy — E-Commerce App (React + Express + SQLite)

A full-stack e-commerce web application built with:
- **Frontend:** React.js + Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, SQLite, Sequelize, JWT, bcrypt

No external database service needed — SQLite stores everything in a single
local file (`backend/database.sqlite`), created automatically the first
time you run the server.

See the full step-by-step tutorial provided in chat for setup instructions,
or follow the quick start below.

## Quick Start

### 1. Backend
```
cd backend
npm install
# copy .env.example to .env and set a JWT_SECRET (any long random string)
npm run dev
```

### 2. Frontend
```
cd frontend
npm install
# copy .env.example to .env
npm run dev
```

Backend runs on http://localhost:5000
Frontend runs on http://localhost:5173
