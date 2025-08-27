const Reward = require('../models/Rewards');
const User = require('../models/User');

// @desc    Get user's rewards
// @route   GET /api/rewards
// @access  Private
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ user: req.user.id });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new reward
// @route   POST /api/rewards
// @access  Private
const addReward = async (req, res) => {
  try {
    const { title, cost } = req.body;
    if (!title || !cost) {
      return res.status(400).json({ message: 'Please provide a title and XP cost' });
    }

    const reward = await Reward.create({
      title,
      cost: Number(cost),
      user: req.user.id,
    });

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Redeem a reward
// @route   POST /api/rewards/redeem/:id
// @access  Private
const redeemReward = async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!reward) {
            return res.status(404).json({ message: 'Reward not found' });
        }
        if (reward.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (user.xp < reward.cost) {
            return res.status(400).json({ message: 'Not enough XP to redeem this reward' });
        }

        // Subtract cost from user's XP
        user.xp -= reward.cost;
        await user.save();

        // We can choose to delete the reward after redemption or keep it.
        // For custom rewards, it's often better to keep them so they can be redeemed again.
        // If you wanted to delete it, you would add: await reward.deleteOne();

        res.status(200).json({ message: 'Reward redeemed successfully!', newXp: user.xp });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReward = async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id);

        if (!reward) {
            return res.status(404).json({ message: 'Reward not found' });
        }
        if (reward.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await reward.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Reward deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getRewards, addReward, redeemReward, deleteReward };
