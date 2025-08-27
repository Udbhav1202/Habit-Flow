const express = require("express");
const router = express.Router();
const { getRewards, addReward, redeemReward } = require("../controllers/rewardController");
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRewards);
router.post('/', protect, addReward);
router.post('/redeem/:id', protect, redeemReward);

module.exports = router;
