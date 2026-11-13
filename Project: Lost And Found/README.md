# 🎓 CampusTrace - University Lost & Found Web Portal

> **Academic Project Submission**  
> **Course Subject:** **Full Stack Web Development**  
> **Architecture:** **MERN / React.js + Node.js & Express.js REST API**  

![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Backend-Node.js_v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/API-Express.js_REST-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Evaluation-Ready_for_Submission-success?style=for-the-badge)

---

## 📌 1. Project Overview & Architecture

**CampusTrace** is a full stack web application engineered specifically for university campuses to streamline the recovery, reporting, and administrative verification of lost and found personal belongings.

The repository follows the gold-standard, industry-accepted **two-folder separation**:
```
LostAndFound-FullStack/
├── backend/                       <-- Node.js & Express.js REST API
│   ├── server.js                  <-- Express server entry point (Port 5000)
│   ├── package.json               <-- Express, CORS, Morgan dependencies
│   └── src/
│       ├── controllers/           <-- Item, Claim, Category & Dashboard controllers
│       ├── routes/                <-- Express Routers
│       ├── models/                <-- Persistent database engine with auto-seed
│       ├── middleware/            <-- Centralized error handling
│       └── data/                  <-- Pre-populated campus database
│
├── frontend/                      <-- React.js SPA (Single Page Application)
│   ├── package.json               <-- React 18 & Vite configuration
│   ├── vite.config.js             <-- Vite development proxy
│   ├── index.html                 <-- Entry HTML
│   └── src/
│       ├── App.jsx                <-- Root application state & router
│       ├── main.jsx               <-- React DOM rendering
│       ├── index.css              <-- Custom responsive CSS design system
│       └── components/
│           ├── Navbar.jsx         <-- Navigation bar & modal triggers
│           ├── HeroStats.jsx      <-- Live aggregate metrics banner
│           ├── FilterBar.jsx      <-- Search input, Category & Type filters
│           ├── ItemCard.jsx       <-- Card rendering with status badges
│           ├── ReportModal.jsx    <-- Report Lost / Found modal form
│           ├── ClaimModal.jsx     <-- Ownership verification claim form
│           ├── ItemDetailModal.jsx<-- Full property view & reporter contact
│           └── AdminDesk.jsx      <-- Campus Security claim review console
│
├── .gitignore                     <-- Clean git ignores (node_modules, logs)
└── README.md                      <-- Complete documentation & setup instructions
```

---

## ✨ 2. Key Features

### A. Student Portal
1. **Live Search & Multilevel Filtering:** Real-time debounce search across item titles, descriptions, and campus buildings with category and status dropdowns.
2. **Report Lost / Found Belongings:** Form supporting photos, campus locations, dates, identifying details, and student registration ID.
3. **Two-Step Ownership Verification:** Claimants must submit non-public proof of ownership (e.g., serial number, lockscreen wallpaper, distinctive scratches) to prevent fraudulent claims.
4. **Live Campus Statistics:** Hero banner displaying real-time metrics for active lost items, cataloged found property, pending claims, and reunited items.

### B. Security Desk / Admin Console
1. **Verification Queue:** Campus security reviews student claims with submitted proof descriptions.
2. **One-Click Approval / Rejection:**
   - **Approve Claim:** Automatically transitions item to `CLAIMED` and rejects competing claims.
   - **Reject Claim:** Records officer remarks and keeps item open for valid owners.
3. **Master Property Ledger:** Admin status override and item management.

---

## 🔌 3. REST API Documentation (Backend)

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/items` | Search & filter cataloged items (`keyword`, `itemType`, `categoryId`, `status`) | `200 OK` |
| `POST` | `/api/items` | Report a new lost or found item | `201 Created` |
| `GET` | `/api/items/:id` | Fetch item details with claim count | `200 OK` |
| `PATCH`| `/api/items/:id/status` | Update item status (`REPORTED`, `CLAIMED`, `RESOLVED`) | `200 OK` |
| `DELETE`| `/api/items/:id` | Delete an item | `200 OK` |
| `POST` | `/api/claims` | Submit an ownership verification claim (with fraud checks) | `201 Created` |
| `GET` | `/api/claims` | List claims (optional filter: `?status=PENDING`) | `200 OK` |
| `PATCH`| `/api/claims/:id/review`| Approve or reject claim with officer remarks | `200 OK` |
| `GET` | `/api/categories` | List 7 standard campus categories | `200 OK` |
| `GET` | `/api/dashboard/stats` | Aggregate dashboard metrics | `200 OK` |
| `GET` | `/api/health` | Health check endpoint | `200 OK` |

---

## 👥 6. Pre-Loaded Test Scenarios

The system starts pre-populated with realistic campus items for immediate teacher evaluation:
* **Item 1:** Apple MacBook Air 13" (Found at Central Library - 2nd Floor, Locker #4)
* **Item 2:** Campus Student ID Card - Emily Chen (Lost near Science Quad / Cafeteria)
* **Item 3:** Hydro Flask 32oz Cobalt Blue (Found at Athletics Track)
* **Item 4:** Sony WF-1000XM4 Wireless Earbuds (Lost in Engineering Block Hall 101)
* **Item 5:** Leather Keychain with 2 Keys + Honda Key Fob (Found at Student Center)
* **Active Claim:** Student Aarav Sharma claiming Item 1 with serial number proof.

---

Thank you
