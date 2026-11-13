const { readDB, writeDB } = require('../models/db');

exports.getItems = (req, res) => {
  const { keyword, itemType, categoryId, status } = req.query;
  const db = readDB();
  let items = [...db.items];

  if (itemType) {
    items = items.filter(i => i.itemType === itemType.toUpperCase());
  }

  if (categoryId) {
    items = items.filter(i => i.categoryId === parseInt(categoryId));
  }

  if (status) {
    items = items.filter(i => i.status === status.toUpperCase());
  }

  if (keyword) {
    const q = keyword.toLowerCase().trim();
    items = items.filter(i =>
      (i.title && i.title.toLowerCase().includes(q)) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.campusLocation && i.campusLocation.toLowerCase().includes(q))
    );
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const result = items.map(item => {
    const claims = db.claims.filter(c => c.itemId === item.id);
    return { ...item, claimCount: claims.length };
  });

  return res.json({
    success: true,
    message: "Items retrieved successfully",
    data: result
  });
};

exports.getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const item = db.items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ success: false, message: `Item not found with id: ${id}` });
  }

  const claims = db.claims.filter(c => c.itemId === item.id);
  return res.json({ success: true, message: "Item details", data: { ...item, claimCount: claims.length } });
};

exports.reportItem = (req, res) => {
  const {
    title, description, itemType, categoryId, campusLocation,
    eventDate, primaryColor, brandOrModel, identifyingMarks,
    storageLocation, imageUrl, reporterUniversityId
  } = req.body;

  if (!title || !itemType || !categoryId || !campusLocation || !reporterUniversityId) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing: title, itemType, categoryId, campusLocation, reporterUniversityId"
    });
  }

  const db = readDB();
  const category = db.categories.find(c => c.id === parseInt(categoryId));
  if (!category) {
    return res.status(404).json({ success: false, message: `Category not found with id: ${categoryId}` });
  }

  let user = db.users.find(u => u.universityId.toLowerCase() === reporterUniversityId.toLowerCase());
  if (!user) {
    const newUserId = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
    user = {
      id: newUserId,
      universityId: reporterUniversityId,
      fullName: `Student (${reporterUniversityId})`,
      email: `${reporterUniversityId.toLowerCase()}@university.edu`,
      phone: "N/A",
      department: "Campus Community",
      role: "ROLE_STUDENT"
    };
    db.users.push(user);
  }

  const newItemId = db.items.length ? Math.max(...db.items.map(i => i.id)) + 1 : 1;
  const newItem = {
    id: newItemId,
    title: title.trim(),
    description: description || "",
    itemType: itemType.toUpperCase(),
    categoryId: category.id,
    categoryName: category.name,
    campusLocation: campusLocation.trim(),
    eventDate: eventDate || new Date().toISOString().split('T')[0],
    status: "REPORTED",
    primaryColor: primaryColor || null,
    brandOrModel: brandOrModel || null,
    identifyingMarks: identifyingMarks || null,
    storageLocation: storageLocation || null,
    imageUrl: imageUrl || null,
    reporterId: user.id,
    reporterName: user.fullName,
    reporterUniversityId: user.universityId,
    reporterEmail: user.email,
    reporterPhone: user.phone,
    createdAt: new Date().toISOString()
  };

  db.items.push(newItem);
  writeDB(db);

  return res.status(201).json({ success: true, message: "Item reported successfully", data: newItem });
};

exports.updateItemStatus = (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ success: false, message: "Query parameter 'status' is required" });
  }

  const db = readDB();
  const itemIndex = db.items.findIndex(i => i.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: `Item not found with id: ${id}` });
  }

  db.items[itemIndex].status = status.toUpperCase();
  db.items[itemIndex].updatedAt = new Date().toISOString();
  writeDB(db);

  return res.json({ success: true, message: "Item status updated", data: db.items[itemIndex] });
};

exports.deleteItem = (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const initialLength = db.items.length;
  db.items = db.items.filter(i => i.id !== id);

  if (db.items.length === initialLength) {
    return res.status(404).json({ success: false, message: `Item not found with id: ${id}` });
  }

  db.claims = db.claims.filter(c => c.itemId !== id);
  writeDB(db);

  return res.json({ success: true, message: "Item deleted successfully", data: null });
};
