# ✅ Task Manager

A full-stack task management application (admin + user dashboards) used as a
learning base to understand a complete MERN + TypeScript project: REST API
with Express, MongoDB / Mongoose, JWT authentication, file uploads with
Multer, Excel exports with ExcelJS, and a React 19 / Vite / Tailwind 4
frontend with Recharts.

## 📖 About the Project

This repository is designed to learn how a full-stack app works end-to-end:
TypeScript on both sides, monorepo structure (`backend/` + `frontend/`),
role-based authorization (admin / user), CRUD with sub-documents
(`todoChecklist`), file upload, and chart rendering.

The patterns used here (JWT auth, role middleware, REST controllers, React
context, custom hooks, Recharts) can be reused in many other projects.

## 🧰 Tech Stack

### 🛠️ Backend

| Technology    | Usage                              |
| ------------- | ---------------------------------- |
| Node.js       | JavaScript runtime                 |
| Express 5     | HTTP server / REST API             |
| TypeScript    | Typed source                       |
| Mongoose 9    | ODM for MongoDB                    |
| MongoDB       | Database                           |
| JWT           | Authentication (token + cookie)    |
| bcryptjs      | Password hashing                   |
| Multer        | File uploads (profile image)       |
| ExcelJS       | Excel reports                      |
| dotenv        | Environment variables              |
| tsx           | TypeScript runner (dev + seed)     |

### 🎨 Frontend

| Technology       | Usage                            |
| ---------------- | -------------------------------- |
| React 19         | UI library                       |
| Vite 8           | Dev server / bundler             |
| TypeScript       | Typed source                     |
| Tailwind CSS 4   | Styling                          |
| React Router 7   | Routing                          |
| Axios            | HTTP client                      |
| Recharts 3       | Charts                           |
| Moment           | Date formatting                  |
| React Hot Toast  | Notifications                    |
| React Icons      | Icon set                         |

## ⚙️ Prerequisites

Before cloning and running the project, make sure you have:

- **Node.js** (v18 or higher, recommended v22) — https://nodejs.org
- **npm** (v9 or higher, included with Node.js)
- **MongoDB** — local instance or a cloud service (MongoDB Atlas)
- **Git** — to clone the repository

## 📥 Get the Project from GitHub

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Krost-t/task-manager.git
cd task-manager
```

If you use SSH:

```bash
git clone git@github.com:Krost-t/task-manager.git
cd task-manager
```

### 2️⃣ Choose a Branch (if needed)

```bash
git branch -a
git checkout main
```

## 📦 Install Dependencies

The project is a monorepo with two independent packages. Install them
separately.

### 🛠️ Backend

```bash
cd backend
npm install
```

### 🎨 Frontend

From the project root:

```bash
cd frontend
npm install
```

## 🔑 Environment Variables

### 🛠️ Backend — `backend/.env`

Create a `.env` file in `backend/` (next to `package.json`). This file must
**not** be committed to Git (already in `.gitignore`).

```env
PORT=8000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/task-manager

JWT_SECRET=a-long-random-secret-key
JWT_COOKIE_EXPIRES_IN=7

ADMIN_INVITE_TOKEN=change-me-to-allow-admin-signup
NODE_ENV=development
```

You must adapt:

- `MONGO_URI` — connection string to your MongoDB (local or Atlas)
- `JWT_SECRET` — any long random string
- `JWT_COOKIE_EXPIRES_IN` — JWT lifetime **in days**
- `ADMIN_INVITE_TOKEN` — secret required at registration to obtain the
  `admin` role
- `CLIENT_URL` — origin allowed by CORS (Vite default is `http://localhost:5173`)

### 🎨 Frontend — `frontend/.env` (optional)

If you want to override the API base URL used by Axios, create
`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🌱 Seed the Database (optional but recommended)

From `backend/`:

```bash
npm run seed
```

This will:

1. **Wipe** the `users` and `tasks` collections.
2. Create **2 users**:
   - `admin@example.com` / `Admin1234!` (role: `admin`)
   - `user@example.com` / `User1234!` (role: `user`)
   - both with a pravatar profile image
3. Create **8 tasks** spread across priorities (Low / Medium / High) and
   statuses (Pending / In-Progress / Completed), assigned to either the
   admin, the user, or both.

## 🚀 Run the Project

You need two terminals: one for the API, one for the frontend.

### 🛠️ Backend (dev mode, auto-reload)

```bash
cd backend
npm run dev
```

The API starts on `http://localhost:8000` (or whatever you set in `PORT`).
You should see:

```
MongoDB connected
Server is running on port 8000
```

### 🎨 Frontend (Vite dev server)

```bash
cd frontend
npm run dev
```

The frontend starts on `http://localhost:5173`.

## 🧪 Test the API

- **Base URL:** `http://localhost:8000`
- Use Postman, Insomnia, curl, or the running frontend.
- Most routes require a JWT — either as an `Authorization: Bearer <token>`
  header or as the `jwt` cookie set on login.

Example (login):

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin1234!\"}"
```

## 📂 Project Structure

```bash
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── report.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   └── upload.middleware copy.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   └── report.routes.ts
│   │   ├── utils/
│   │   │   ├── generate.token.ts
│   │   │   └── seed.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Cards/
│   │   │   ├── Charts/
│   │   │   ├── Inputs/
│   │   │   └── layouts/
│   │   ├── context/
│   │   │   └── UserContext.tsx
│   │   ├── hooks/
│   │   │   └── useUserAuth.ts
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   └── User/
│   │   ├── utils/
│   │   │   ├── apiPaths.ts
│   │   │   ├── axiosInstance.ts
│   │   │   ├── helper.ts
│   │   │   └── uploadImage.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── LICENSE
└── README.md
```

## 🔐 API Endpoints

### 👤 Authentication (`/api/auth`)

| Method | Route                        | Description           | Body / Auth                                |
| ------ | ---------------------------- | --------------------- | ------------------------------------------ |
| POST   | `/register`                  | Register a user       | `name`, `email`, `password`, `adminInviteToken?` |
| POST   | `/login`                     | Login                 | `email`, `password`                        |
| GET    | `/profile`                   | Current user profile  | JWT                                        |
| PUT    | `/profile`                   | Update profile        | JWT — `name?`, `email?`, `password?`       |
| POST   | `/upload-profile-image`      | Upload profile image  | `multipart/form-data` field `image`        |

### 👥 Users (`/api/users`)

| Method | Route   | Description          | Auth         |
| ------ | ------- | -------------------- | ------------ |
| GET    | `/`     | List all users       | JWT + admin  |
| GET    | `/:id`  | Get a user by id     | JWT          |

### ✅ Tasks (`/api/tasks`) — JWT protected

| Method | Route                    | Description                  | Auth         |
| ------ | ------------------------ | ---------------------------- | ------------ |
| GET    | `/dashboard-data`        | Global dashboard data        | JWT          |
| GET    | `/user-dashboard-data`   | Current user dashboard data  | JWT          |
| GET    | `/`                      | List tasks (filter by status)| JWT          |
| GET    | `/:id`                   | Get a task by id             | JWT          |
| POST   | `/`                      | Create a task                | JWT + admin  |
| PUT    | `/:id`                   | Update a task                | JWT          |
| DELETE | `/:id`                   | Delete a task                | JWT + admin  |
| PUT    | `/:id/status`            | Update task status           | JWT          |
| PUT    | `/:id/todo`              | Update task checklist        | JWT          |

Possible task **status** values: `Pending`, `In-Progress`, `Completed`.
Possible task **priority** values: `Low`, `Medium`, `High`.

### 📊 Reports (`/api/reports`) — JWT + admin

| Method | Route             | Description                |
| ------ | ----------------- | -------------------------- |
| GET    | `/export/tasks`   | Export all tasks as Excel  |
| GET    | `/export/users`   | Export all users as Excel  |

## 🔧 Environment Variables Reference

| Variable                | Required | Description                                       |
| ----------------------- | -------- | ------------------------------------------------- |
| `PORT`                  | Yes      | Backend port                                      |
| `CLIENT_URL`            | Yes      | Allowed CORS origin (frontend URL)                |
| `MONGO_URI`             | Yes      | MongoDB connection URL                            |
| `JWT_SECRET`            | Yes      | Secret used to sign JWTs                          |
| `JWT_COOKIE_EXPIRES_IN` | Yes      | Token lifetime in **days**                        |
| `ADMIN_INVITE_TOKEN`    | No       | Secret to obtain `admin` role at registration     |
| `NODE_ENV`              | No       | `production` enables the secure cookie flag       |
| `VITE_API_BASE_URL`     | No       | Override the API URL used by the frontend         |

## 📜 npm Scripts

### 🛠️ Backend (`backend/package.json`)

| Command          | Description                                |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Start the API in watch mode (tsx watch)    |
| `npm run seed`   | Wipe + reseed users and tasks              |

### 🎨 Frontend (`frontend/package.json`)

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start Vite dev server                |
| `npm run build`    | Type-check + production build        |
| `npm run preview`  | Preview the production build         |
| `npm run lint`     | Run ESLint                           |

## 📄 License

See [LICENSE](./LICENSE). This project is proprietary — **All Rights
Reserved**.

## 📌 Summary

```bash
git clone https://github.com/Krost-t/task-manager.git
cd task-manager

# Backend
cd backend
npm install
# create .env (see Environment Variables section)
npm run seed     # optional: populate DB with demo users + tasks
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm install
npm run dev
```

The app will be available at:

- **API:** `http://localhost:8000`
- **Frontend:** `http://localhost:5173`

Demo credentials after seeding:

- **Admin:** `admin@example.com` / `Admin1234!`
- **User:**  `user@example.com`  / `User1234!`
