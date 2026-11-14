# CampusTrace - University Lost & Found Web Portal

**Course Subject:** Full Stack Web Development  
**Technology Stack:** React (Vite) + Node.js / Express with JSON file persistence

## Overview

CampusTrace is a full-stack web application for university campuses. It helps students report lost or found belongings, search the campus item catalog, and submit ownership claims. Campus security can review claims and manage reported items.

### Architecture

```text
LostAndFound-FullStack/
├── backend/                       # Node.js and Express REST API
│   ├── server.js                  # Server entry point (port 5000)
│   ├── package.json               # Backend dependencies
│   └── src/
│       ├── controllers/            # Item, claim, category, dashboard controllers
│       ├── routes/                 # Express routes
│       ├── models/                 # JSON persistence and seed data
│       ├── middleware/              # Error handling
│       └── data/                   # Campus data
├── frontend/                        # React single-page application
│   ├── package.json                # React and Vite dependencies
│   ├── vite.config.js               # Vite configuration and API proxy
│   ├── index.html                  # HTML entry point
│   └── src/
│       ├── App.jsx                 # Root application
│       ├── main.jsx                # React rendering entry point
│       ├── index.css               # Application styles
│       └── components/
│           ├── Navbar.jsx
│           ├── HeroStats.jsx
│           ├── FilterBar.jsx
│           ├── ItemCard.jsx
│           ├── ReportModal.jsx
│           ├── ClaimModal.jsx
│           ├── ItemDetailModal.jsx
│           └── AdminDesk.jsx
├── .gitignore
└── README.md
```

## Features

### Student Portal
- Search items by title, description, or campus location.
- Filter items by category and status.
- Report lost or found belongings with item details, location, date, and student information.
- Submit ownership claims with identifying proof.
- View campus statistics, including reported items, pending claims, and reunited items.

### Security Desk
- Review submitted ownership claims and proof details.
- Approve or reject claims with officer remarks.
- Automatically mark an item as claimed when a claim is approved and reject competing claims.
- Manage items and update their statuses.

## Setup

### Requirements
- Node.js 18 or later
- npm

### Start the backend

Open a terminal in the project directory:

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:5000`.

Check the backend health endpoint:

```text
http://localhost:5000/api/health
```

### Start the frontend

Open a second terminal in the project directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` (as configured in Vite).

## API Endpoints

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/items` | Search and filter items (`keyword`, `itemType`, `categoryId`, `status`) | `200 OK` |
| POST | `/api/items` | Report a lost or found item | `201 Created` |
| GET | `/api/items/:id` | Get item details and claim count | `200 OK` |
| PATCH | `/api/items/:id/status` | Update item status | `200 OK` |
| DELETE | `/api/items/:id` | Delete an item | `200 OK` |
| POST | `/api/claims` | Submit an ownership claim | `201 Created` |
| GET | `/api/claims` | List claims; optionally filter with `?status=PENDING` | `200 OK` |
| PATCH | `/api/claims/:id/review` | Approve or reject a claim with officer remarks | `200 OK` |
| GET | `/api/categories` | List campus categories | `200 OK` |
| GET | `/api/dashboard/stats` | Get dashboard metrics | `200 OK` |
| GET | `/api/health` | Check API health | `200 OK` |

## Sample Data

The application starts with sample campus records for testing:

- Apple MacBook Air 13-inch, found at Central Library (2nd Floor, Locker #4)
- Student ID card, reported lost near Science Quad / Cafeteria
- Cobalt blue Hydro Flask, found at the Athletics Track
- Sony WF-1000XM4 earbuds, reported lost in Engineering Block Hall 101
- Leather keychain with two keys and a Honda key fob, found at Student Center
- A pending claim for the MacBook Air with serial-number proof

## Persistence

The backend stores application data in JSON files. Seed data is provided for local testing and evaluation.

---
