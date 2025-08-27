const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, "Please add a reward title"],
  },
  cost: {
    type: Number,
    required: [true, "Please add an XP cost"],
    min: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Reward", rewardSchema);
