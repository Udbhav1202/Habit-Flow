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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const isCompletingTask = req.body.completed && !task.completed;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (isCompletingTask) {
      const user = await User.findById(req.user.id);
      let updatedStreak = user.streak;
      
      const today = new Date();
      const lastCompleted = user.lastCompletedForStreak || new Date(0);

     
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const lastCompletedUTC = new Date(Date.UTC(lastCompleted.getUTCFullYear(), lastCompleted.getUTCMonth(), lastCompleted.getUTCDate()));
      
      const oneDay = 24 * 60 * 60 * 1000; 
      const diffDays = Math.round((todayUTC - lastCompletedUTC) / oneDay);

      if (diffDays > 0) { 
        if (diffDays === 1) {
          
          updatedStreak++;
        } else {
          
          updatedStreak = 1;
        }
      }
  

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: { xp: 10 },
          streak: updatedStreak,
          lastCompletedForStreak: today, 
        },
        { new: true }
      );
      
      return res.status(200).json({ updatedTask, updatedUser });
    }

    res.status(200).json({ updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




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

    await task.deleteOne(); 

    res.status(200).json({ id: id, message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCompletedTasks = async (req,res) => {
  try{
    const today = new Date();
    today.setHours(0,0,0,0);

    await Task.deleteMany({
      user: req.user.id,
      completed: true,
      createdAt: {$lt: today}
    });

    res.status(200).json({ message: "Old completed tasks cleared "});
  }catch(error){
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask, clearCompletedTasks };
