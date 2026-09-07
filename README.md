# IC Scan QR Code

A QR code scanning application built with [AdonisJS](https://adonisjs.com/) (backend) and [Inertia.js](https://inertiajs.com/) + React (frontend), using MySQL as the database.

## Tech Stack

- **Backend:** AdonisJS 6
- **Frontend:** React (via Inertia.js)
- **Database:** MySQL (via Lucid ORM)
- **Build tool:** Vite

## Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v24.11 or higher (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://www.mysql.com/) server running locally or remotely
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ic-scan-qrcode.git
cd ic-scan-qrcode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update it with your own values:

```bash
cp .env.example .env
```

Then open `.env` and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=ic_scan_qrcode
```

### 4. Create the database

Make sure the database exists in MySQL before running migrations:

```sql
CREATE DATABASE ic_scan_qrcode;
```

### 5. Run migrations

```bash
node ace migration:run
```

### 6. Start the development server

```bash
npm run dev
```

Once started, open your browser at the address shown in the terminal (e.g. `http://127.0.0.1:3333`).

## Project Structure

```
ic-scan-qrcode/
├── app/                  # Backend logic (controllers, models, middleware)
├── config/               # App configuration files
├── inertia/              # Frontend (React components, pages, layouts)
│   ├── app/              # Inertia app entry & SSR setup
│   ├── css/              # Frontend styles
│   └── pages/            # React page components
├── resources/views/      # Edge templates (Inertia root layout)
├── start/                # Routes, env schema, kernel config
├── database/             # Migrations & seeders
├── .env                  # Environment variables (not committed)
└── package.json
```

## Notes

- This project keeps frontend and backend in a single codebase using Inertia.js — no separate API/SPA setup needed.
- Make sure your MySQL server is running before starting the app or running migrations.
