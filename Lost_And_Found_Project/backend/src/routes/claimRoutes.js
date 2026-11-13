const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

router.post('/', claimController.submitClaim);
router.get('/', claimController.getAllClaims);
router.get('/:id', claimController.getClaimById);
router.patch('/:id/review', claimController.reviewClaim);

module.exports = router;
