
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'database.json');

const defaultData = {
  users: [
    {
      id: 1,
      universityId: "ADMIN001",
      fullName: "Campus Security Desk",
      email: "security@campus.edu",
      phone: "N/A",
      department: "Campus Security",
      role: "ROLE_ADMIN"
    },
    {
      id: 2,
      universityId: "24BCS10657",
      fullName: "Naveen Verma",
      email: "24bcs10657@campus.edu",
      phone: "N/A",
      department: "Computer Science",
      role: "ROLE_STUDENT"
    },
    {
      id: 3,
      universityId: "24BCS10658",
      fullName: "Student Representative",
      email: "student.rep@campus.edu",
      phone: "N/A",
      department: "Computer Science",
      role: "ROLE_STUDENT"
    },
    {
      id: 4,
      universityId: "STAFF001",
      fullName: "Campus Staff",
      email: "staff@campus.edu",
      phone: "N/A",
      department: "Campus Administration",
      role: "ROLE_STAFF"
    }
  ],

  categories: [
    "Electronics",
    "Documents",
    "Accessories",
    "Clothing",
    "Books",
    "Other"
  ],

  items: [
    {
      id: 1,
      title: "Laptop",
      description: "Laptop found in Block 3 Lab.",
      category: "Electronics",
      type: "FOUND",
      location: "Block 3 Lab",
      date: "2026-11-10",
      status: "UNDER_VERIFICATION",
      reportedBy: 4
    },
    {
      id: 2,
      title: "Student ID Card",
      description: "Student ID card lost near Main Canteen.",
      category: "Documents",
      type: "LOST",
      location: "Main Canteen",
      date: "2026-11-11",
      status: "ACTIVE",
      reportedBy: 2
    },
    {
      id: 3,
      title: "Blue Water Bottle",
      description: "Blue water bottle found near Sports Ground.",
      category: "Accessories",
      type: "FOUND",
      location: "Sports Ground",
      date: "2026-11-12",
      status: "ACTIVE",
      reportedBy: 3
    },
    {
      id: 4,
      title: "Wireless Earbuds",
      description: "Wireless earbuds found in Block 3 Lecture Hall.",
      category: "Electronics",
      type: "FOUND",
      location: "Block 3 Lecture Hall",
      date: "2026-11-12",
      status: "ACTIVE",
      reportedBy: 4
    },
    {
      id: 5,
      title: "Keychain",
      description: "Keychain found at Student Activity Centre.",
      category: "Accessories",
      type: "FOUND",
      location: "Student Activity Centre",
      date: "2026-11-13",
      status: "CLAIMED",
      reportedBy: 3
    }
  ],

  claims: [
    {
      id: 1,
      itemId: 1,
      claimantId: 2,
      proof: "Laptop serial number and identification sticker",
      status: "PENDING",
      date: "2026-11-13"
    }
  ]
};

const initDB = () => {
  const dir = path.dirname(DB_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
};

const readDB = () => {
  initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDB = (data) => {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
  initDB,
  readDB,
  writeDB,
  DB_FILE
};
