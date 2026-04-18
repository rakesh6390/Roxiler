# Store Ratings Platform

A full-stack role-based web application where users can sign up, browse stores, and submit ratings (1 to 5).  
The platform supports three roles: `ADMIN`, `USER`, and `STORE_OWNER`.

---

## What This Project Is

This project is built for a full-stack coding assignment and includes:

- Authentication with JWT
- Role-based access control
- Admin dashboard for user/store management
- User store browsing and rating workflow
- Store owner dashboard to monitor ratings
- Backend + frontend validations aligned to assignment requirements

---

## Tech Stack

### Backend
- Node.js
- Express.js
- Sequelize
- MySQL
- JWT (`jsonwebtoken`)
- `bcrypt`
- `express-validator`

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

---

## Quick Start

### 1) Prerequisites

- Node.js 16+
- npm 7+
- MySQL 5.7+ (or 8+)

### 2) Open project

```bash
cd Roxiler
```

### 3) Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=store_ratings
JWT_SECRET=change_this_secret
PORT=4000
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

### 4) Frontend setup

```bash
cd ../frontend
npm install
```

Optional `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

Run frontend:

```bash
npm run dev
```

Open: `http://localhost:5173`

---

## Project Structure

```text
Roxiler/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── ownerController.js
│   │   ├── ratingController.js
│   │   └── storeController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── optionalAuth.js
│   │   ├── roles.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── store.js
│   │   └── rating.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── stores.js
│   │   └── owner.js
│   ├── scripts/
│   │   └── create-db.js
│   ├── .env.sample
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UpdatePassword.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   └── UserStores.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── sql/
│   └── schema.sql
└── README.md
```

---

## Role-Based Functionalities

### `ADMIN`
- View dashboard totals: users, stores, ratings
- Create users (`USER`, `ADMIN`, `STORE_OWNER`)
- Create stores with store-owner assignment
- List and filter users/stores
- Sort users/stores by key fields
- View user details

### `USER`
- Sign up and login
- View all registered stores
- Search stores by name and address
- Sort store listings
- Submit rating (1–5) for a store
- Modify previously submitted rating
- Update own password

### `STORE_OWNER`
- Login and update password
- View owner dashboard
- See users who rated owned stores
- See average store rating

---

## Authentication and Authorization

- JWT token is issued on signup/login
- Token is sent in `Authorization: Bearer <token>`
- Protected backend routes use:
  - `auth` middleware (strict auth)
  - `optionalAuth` middleware (store listing can be public but still include `userRating` when logged in)
  - `roles` middleware (role-based endpoint restrictions)

---

## Form Validation Rules

- **Name**: 20–60 characters
- **Address**: 1–400 characters
- **Password**: 8–16 characters, at least one uppercase and one special character
- **Email**: valid email format
- **Rating**: integer between 1 and 5

---

## Core API Overview

Base URL: `http://localhost:4000/api`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/update-password`

### Admin
- `GET /admin/dashboard`
- `POST /admin/users`
- `GET /admin/users`
- `GET /admin/users/:id`
- `POST /admin/stores`
- `GET /admin/stores`
- `GET /admin/store-owners`

### Stores/Ratings
- `GET /stores`
- `POST /stores/:id/rating`
- `PUT /stores/:id/rating`

### Owner
- `GET /owner/dashboard`

---

## Signup for Different Roles

The signup form supports selecting role:

- `USER`
- `ADMIN`
- `STORE_OWNER`

The selected role is validated in backend during signup.

---

## Database Notes

Database schema is available in `sql/schema.sql` with tables:

- `users`
- `stores`
- `ratings`

Important constraints:

- unique user email
- unique rating per (`user_id`, `store_id`)
- rating check between 1 and 5

---

## Build and Run Commands

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

### Frontend production build

```bash
cd frontend
npm run build
```

---

## Troubleshooting

### Backend not starting
- Verify MySQL service is running
- Check `backend/.env` DB credentials
- Confirm database exists (`store_ratings`)

### Frontend cannot call API
- Ensure backend is running on `PORT=4000`
- Check `VITE_API_URL` in frontend env

### Unauthorized errors
- Ensure valid token is present
- Check user role for restricted endpoint

---

## Security and Best-Practice Notes

- Passwords are hashed with bcrypt
- Sensitive config is stored in `.env`
- `.env` files should not be committed
- Use a strong `JWT_SECRET` in production

---

## Future Improvements

- Pagination for large user/store lists
- Better error UI instead of alerts
- Test coverage (unit/integration)
- Audit logs for admin actions
- Rate analytics over time

---

## License

For assignment/demo use. Add an explicit license if needed.
