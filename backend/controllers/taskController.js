const Task = require("../models/Task");
const User = require("../models/User"); // We need the User model as well

// @desc    Get user's tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // Find tasks that belong to the logged-in user
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new task
// @route   POST /api/tasks
// @access  Private
const addTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Create the task and associate it with the logged-in user
    const task = await Task.create({
      title,
      user: req.user.id, // Assign the user ID from the middleware
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure the logged-in user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Check if the task is being marked as complete for the first time
    const isCompletingTask = req.body.completed && !task.completed;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If the task was just completed, award XP
    if (isCompletingTask) {
      await User.findByIdAndUpdate(req.user.id, { $inc: { xp: 10 } });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure the logged-in user owns the task
    if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    await task.deleteOne(); // Use deleteOne() instead of remove()

    res.status(200).json({ id: id, message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
