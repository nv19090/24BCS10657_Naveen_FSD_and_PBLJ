const { readDB } = require('../models/db');

exports.getStats = (req, res) => {
  const db = readDB();
  const totalItems = db.items.length;
  const totalLostItems = db.items.filter(i => i.itemType === 'LOST').length;
  const totalFoundItems = db.items.filter(i => i.itemType === 'FOUND').length;
  const totalPendingClaims = db.claims.filter(c => c.status === 'PENDING').length;
  const totalApprovedClaims = db.claims.filter(c => c.status === 'APPROVED').length;
  const totalResolvedItems = db.items.filter(i => i.status === 'CLAIMED' || i.status === 'RESOLVED').length;

  return res.json({
    success: true,
    message: "Statistics retrieved",
    data: {
      totalItems,
      totalLostItems,
      totalFoundItems,
      totalPendingClaims,
      totalApprovedClaims,
      totalResolvedItems
    }
  });
};
