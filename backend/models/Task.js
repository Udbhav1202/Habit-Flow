const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  // Add this user field
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This creates a reference to the User model
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
