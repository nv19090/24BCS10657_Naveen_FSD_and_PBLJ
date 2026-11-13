const { readDB } = require('../models/db');

exports.getCategories = (req, res) => {
  const db = readDB();
  return res.json({
    success: true,
    message: "Categories retrieved",
    data: db.categories
  });
};
