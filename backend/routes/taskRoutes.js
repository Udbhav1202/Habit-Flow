const express = require("express");
const router = express.Router();
const { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  clearCompletedTasks 
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Get and Add tasks
router.route("/").get(protect, getTasks).post(protect, addTask);

// Route to clear old completed tasks
router.route("/clear-completed").post(protect, clearCompletedTasks);

// Update and Delete a specific task
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;

