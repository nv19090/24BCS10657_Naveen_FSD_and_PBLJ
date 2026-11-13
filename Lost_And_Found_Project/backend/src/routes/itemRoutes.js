const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getItems);
router.post('/', itemController.reportItem);
router.get('/:id', itemController.getItemById);
router.patch('/:id/status', itemController.updateItemStatus);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
