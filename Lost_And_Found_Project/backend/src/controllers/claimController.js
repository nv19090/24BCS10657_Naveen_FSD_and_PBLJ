const { readDB, writeDB } = require('../models/db');

exports.submitClaim = (req, res) => {
  const { itemId, claimantUniversityId, proofDescription, proofDocumentOrImage } = req.body;

  if (!itemId || !claimantUniversityId || !proofDescription) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing: itemId, claimantUniversityId, proofDescription"
    });
  }

  const db = readDB();
  const item = db.items.find(i => i.id === parseInt(itemId));

  if (!item) {
    return res.status(404).json({ success: false, message: `Item not found with id: ${itemId}` });
  }

  if (item.status === "RESOLVED") {
    return res.status(400).json({ success: false, message: "Item is already resolved and no longer accepting claims." });
  }

  if (item.reporterUniversityId && item.reporterUniversityId.toLowerCase() === claimantUniversityId.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Fraud prevention: You cannot submit a claim for an item you reported yourself." });
  }

  const duplicate = db.claims.some(c =>
    c.itemId === item.id &&
    c.claimantUniversityId.toLowerCase() === claimantUniversityId.toLowerCase() &&
    c.status === "PENDING"
  );

  if (duplicate) {
    return res.status(400).json({ success: false, message: "You already have an active pending claim for this item." });
  }

  let user = db.users.find(u => u.universityId.toLowerCase() === claimantUniversityId.toLowerCase());
  if (!user) {
    const newUserId = db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
    user = {
      id: newUserId,
      universityId: claimantUniversityId,
      fullName: `Student (${claimantUniversityId})`,
      email: `${claimantUniversityId.toLowerCase()}@university.edu`,
      phone: "N/A",
      department: "Campus Community",
      role: "ROLE_STUDENT"
    };
    db.users.push(user);
  }

  const newClaimId = db.claims.length ? Math.max(...db.claims.map(c => c.id)) + 1 : 1;
  const newClaim = {
    id: newClaimId,
    itemId: item.id,
    itemTitle: item.title,
    itemType: item.itemType,
    itemCampusLocation: item.campusLocation,
    claimantId: user.id,
    claimantName: user.fullName,
    claimantUniversityId: user.universityId,
    claimantEmail: user.email,
    claimantPhone: user.phone,
    proofDescription: proofDescription.trim(),
    proofDocumentOrImage: proofDocumentOrImage || null,
    status: "PENDING",
    adminRemarks: null,
    reviewedAt: null,
    createdAt: new Date().toISOString()
  };

  db.claims.push(newClaim);

  if (item.status === "REPORTED") {
    item.status = "UNDER_VERIFICATION";
  }

  writeDB(db);

  return res.status(201).json({ success: true, message: "Claim submitted successfully for review", data: newClaim });
};

exports.getAllClaims = (req, res) => {
  const { status } = req.query;
  const db = readDB();
  let claims = [...db.claims];

  if (status) {
    claims = claims.filter(c => c.status === status.toUpperCase());
  }

  claims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json({ success: true, message: "Claims retrieved", data: claims });
};

exports.getClaimById = (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const claim = db.claims.find(c => c.id === id);

  if (!claim) {
    return res.status(404).json({ success: false, message: `Claim not found with id: ${id}` });
  }

  return res.json({ success: true, message: "Claim details", data: claim });
};

exports.reviewClaim = (req, res) => {
  const claimId = parseInt(req.params.id);
  const { status, adminRemarks } = req.body;

  if (!status || !["APPROVED", "REJECTED"].includes(status.toUpperCase())) {
    return res.status(400).json({ success: false, message: "Valid status required: APPROVED or REJECTED" });
  }

  const db = readDB();
  const claimIndex = db.claims.findIndex(c => c.id === claimId);
  if (claimIndex === -1) {
    return res.status(404).json({ success: false, message: `Claim not found with id: ${claimId}` });
  }

  const decision = status.toUpperCase();
  db.claims[claimIndex].status = decision;
  db.claims[claimIndex].adminRemarks = adminRemarks || null;
  db.claims[claimIndex].reviewedAt = new Date().toISOString();

  const item = db.items.find(i => i.id === db.claims[claimIndex].itemId);

  if (decision === "APPROVED") {
    if (item) item.status = "CLAIMED";
    db.claims.forEach(c => {
      if (c.itemId === db.claims[claimIndex].itemId && c.id !== claimId && c.status === "PENDING") {
        c.status = "REJECTED";
        c.adminRemarks = "Item released to verified claimant.";
        c.reviewedAt = new Date().toISOString();
      }
    });
  } else if (decision === "REJECTED") {
    if (item) {
      const activePending = db.claims.filter(c => c.itemId === item.id && c.id !== claimId && c.status === "PENDING");
      if (activePending.length === 0 && item.status === "UNDER_VERIFICATION") {
        item.status = "REPORTED";
      }
    }
  }

  writeDB(db);

  return res.json({ success: true, message: "Claim review processed", data: db.claims[claimIndex] });
};
