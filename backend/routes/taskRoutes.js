const express = require("express");
const router = express.Router();
const { 
  addTask, 
  getTasks, 
  updateTask, 
  deleteTask 
} = require("../controllers/taskController");
const { protect } = require('../middleware/authMiddleware'); // 1. Import the middleware

// 2. Add the 'protect' middleware to each route
// This ensures only logged-in users can access these endpoints
router.post("/", protect, addTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask); // Corrected from .put to .delete

module.exports = router;
