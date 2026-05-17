# smartlead

SmartLead is a full-stack Lead Management CRM application built using the MERN stack for managing customer leads efficiently.

---

# Features

- JWT Authentication
- Protected Routes
- Role-Based Access
- Create Leads
- Edit Leads
- Delete Leads
- Search Leads
- Filter Leads
- Pagination
- CSV Export
- Responsive Dashboard UI

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Axios

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

---

# Project Structure

```txt
smartlead/
│
├── frontend/
│
├── backend/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── .gitignore
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/madhumathi789/smartlead.git
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Backend Scripts

```bash
npm run dev
```
Runs backend using nodemon + ts-node.

```bash
npm run build
```
Compiles TypeScript files into `dist/`.

```bash
npm start
```
Runs production build from `dist/index.js`.

---

# Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

# API Routes

## Authentication

```http
POST /api/auth/login
```

---

## Leads

```http
GET /api/leads
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id
```

---

# Sample Credentials

## Admin

```txt
Email: admin@test.com
Password: 123456
```

---

# Deployment

Frontend and Backend deployed using Render.

---

# Future Improvements

- Analytics Dashboard
- Charts & Reports
- Email Notifications
- Advanced Filters
- Activity Logs

---

# Author

Madhumathi