const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'database.json');

const defaultData = {
  categories: [
    { id: 1, name: "Electronics & Gadgets", description: "Laptops, phones, headphones, chargers", iconCode: "laptop" },
    { id: 2, name: "ID Cards & Wallets", description: "Campus student IDs, driver licenses, wallets", iconCode: "id-card" },
    { id: 3, name: "Books & Stationery", description: "Textbooks, notebooks, scientific calculators", iconCode: "book" },
    { id: 4, name: "Keys & Badges", description: "Dorm keys, bike locks, access lanyards", iconCode: "key" },
    { id: 5, name: "Bags & Backpacks", description: "Backpacks, duffel bags, laptop sleeves", iconCode: "shopping-bag" },
    { id: 6, name: "Clothing & Accessories", description: "Jackets, water bottles, umbrellas", iconCode: "shirt" },
    { id: 7, name: "Other Items", description: "Miscellaneous personal belongings found on campus", iconCode: "tag" }
  ],
  users: [
    { id: 1, universityId: "ADMIN001", fullName: "Campus Security Desk", email: "security@university.edu", phone: "+1-555-0100", department: "Campus Safety", role: "ROLE_ADMIN" },
    { id: 2, universityId: "STU202401", fullName: "Aarav Sharma", email: "aarav.sharma@university.edu", phone: "+1-555-0111", department: "Computer Science", role: "ROLE_STUDENT" },
    { id: 3, universityId: "STU202402", fullName: "Emily Chen", email: "emily.chen@university.edu", phone: "+1-555-0122", department: "Electrical Engineering", role: "ROLE_STUDENT" },
    { id: 4, universityId: "STF8801", fullName: "Prof. David Miller", email: "david.miller@university.edu", phone: "+1-555-0199", department: "Physics Department", role: "ROLE_STAFF" }
  ],
  items: [
    {
      id: 1,
      title: "Apple MacBook Air 13\" (Space Gray)",
      description: "Found on Table 14 in Central Library 2nd floor reading hall. Blue sticker with GitHub Octocat on back lid. Left on charging adapter.",
      itemType: "FOUND",
      categoryId: 1,
      categoryName: "Electronics & Gadgets",
      campusLocation: "Central Library - 2nd Floor",
      eventDate: "2026-11-12",
      status: "UNDER_VERIFICATION",
      primaryColor: "Space Gray",
      brandOrModel: "Apple MacBook Air M2",
      storageLocation: "Central Library Security Desk - Locker #4",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      reporterId: 1,
      reporterName: "Campus Security Desk",
      reporterUniversityId: "ADMIN001",
      reporterEmail: "security@university.edu",
      reporterPhone: "+1-555-0100",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 2,
      title: "Campus Student ID Card - Emily Chen",
      description: "Dropped my plastic student badge between Science Building Quad and Campus Cafeteria during lunchtime.",
      itemType: "LOST",
      categoryId: 2,
      categoryName: "ID Cards & Wallets",
      campusLocation: "Science Quad / Cafeteria Pathway",
      eventDate: "2026-11-11",
      status: "REPORTED",
      primaryColor: "Blue & White",
      identifyingMarks: "ID# STU202402, Electrical Engineering Department",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
      reporterId: 3,
      reporterName: "Emily Chen",
      reporterUniversityId: "STU202402",
      reporterEmail: "emily.chen@university.edu",
      reporterPhone: "+1-555-0122",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 3,
      title: "Hydro Flask 32oz Wide Mouth (Cobalt Blue)",
      description: "Left beside Bench 3 at University Athletic Track. Has several national park stickers and slight dent on bottom rim.",
      itemType: "FOUND",
      categoryId: 6,
      categoryName: "Clothing & Accessories",
      campusLocation: "Athletics Complex - Track & Field",
      eventDate: "2026-11-10",
      status: "REPORTED",
      primaryColor: "Cobalt Blue",
      brandOrModel: "Hydro Flask 32oz",
      storageLocation: "Gym Reception Lost & Found Bin",
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      reporterId: 2,
      reporterName: "Aarav Sharma",
      reporterUniversityId: "STU202401",
      reporterEmail: "aarav.sharma@university.edu",
      reporterPhone: "+1-555-0111",
      createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: 4,
      title: "Sony WF-1000XM4 Wireless Earbuds (Black)",
      description: "Lost charging case with earbuds inside near Engineering Lecture Hall 101 after 3 PM Distributed Systems lecture.",
      itemType: "LOST",
      categoryId: 1,
      categoryName: "Electronics & Gadgets",
      campusLocation: "Engineering Block - Hall 101",
      eventDate: "2026-11-12",
      status: "REPORTED",
      primaryColor: "Matte Black",
      brandOrModel: "Sony WF-1000XM4",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      reporterId: 2,
      reporterName: "Aarav Sharma",
      reporterUniversityId: "STU202401",
      reporterEmail: "aarav.sharma@university.edu",
      reporterPhone: "+1-555-0111",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 5,
      title: "Leather Keychain with 2 Keys + Honda Key Fob",
      description: "Found on front steps of Student Center Building. Leather strap stamped with initials 'J.M.'",
      itemType: "FOUND",
      categoryId: 4,
      categoryName: "Keys & Badges",
      campusLocation: "Student Center - Main Entrance",
      eventDate: "2026-11-09",
      status: "CLAIMED",
      primaryColor: "Brown Leather",
      brandOrModel: "Honda Key Fob",
      storageLocation: "Student Affairs Front Office, Room 102",
      imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
      reporterId: 4,
      reporterName: "Prof. David Miller",
      reporterUniversityId: "STF8801",
      reporterEmail: "david.miller@university.edu",
      reporterPhone: "+1-555-0199",
      createdAt: new Date(Date.now() - 345600000).toISOString()
    }
  ],
  claims: [
    {
      id: 1,
      itemId: 1,
      itemTitle: "Apple MacBook Air 13\" (Space Gray)",
      itemType: "FOUND",
      itemCampusLocation: "Central Library - 2nd Floor",
      claimantId: 2,
      claimantName: "Aarav Sharma",
      claimantUniversityId: "STU202401",
      claimantEmail: "aarav.sharma@university.edu",
      claimantPhone: "+1-555-0111",
      proofDescription: "This is my laptop! Serial number ends in '3K9Y'. The desktop wallpaper is a photo of the Swiss Alps, and the user login name is 'aarav'. I left it when rushing to my Algorithms tutorial.",
      proofDocumentOrImage: null,
      status: "PENDING",
      adminRemarks: null,
      reviewedAt: null,
      createdAt: new Date(Date.now() - 43200000).toISOString()
    }
  ]
};

function initDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultData;
  }
}

function writeDB(data) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readDB,
  writeDB
};
