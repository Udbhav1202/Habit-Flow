const express = require("express");
const router = express.Router();
const { getRewards, addReward, redeemReward, deleteReward } = require("../controllers/rewardController");
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRewards);
router.post('/', protect, addReward);
router.post('/redeem/:id', protect, redeemReward);
router.delete('/:id', protect, deleteReward); 

module.exports = router;
