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

    // --- NEW LOGIC TO CHECK IF XP SHOULD BE AWARDED ---
    // This is only true if the request is to complete the task AND xp has NOT been awarded yet.
    const shouldAwardXp = req.body.completed && !task.xpAwarded;

    const updatePayload = { ...req.body };
    // If we're awarding XP, permanently mark this task as having awarded XP.
    if (shouldAwardXp) {
      updatePayload.xpAwarded = true;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
    });

    // --- ONLY RUN GAMIFICATION IF XP SHOULD BE AWARDED ---
    if (shouldAwardXp) {
      const user = await User.findById(req.user.id);
      let updatedStreak = user.streak;
      
      const today = new Date();
      const lastCompleted = user.lastCompletedForStreak || new Date(0);

      // Normalize both dates to midnight UTC to compare calendar days
      const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
      const lastCompletedUTC = new Date(Date.UTC(lastCompleted.getUTCFullYear(), lastCompleted.getUTCMonth(), lastCompleted.getUTCDate()));
      
      const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
      const diffDays = Math.round((todayUTC - lastCompletedUTC) / oneDay);

      if (diffDays > 0) { // Only update if it's a new day
        if (diffDays === 1) {
          // It was exactly yesterday, continue the streak
          updatedStreak++;
        } else {
          // It was more than one day ago, reset streak to 1
          updatedStreak = 1;
        }
      }
      // If diffDays is 0, it's the same day, so the streak does not change.

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: { xp: 10 },
          streak: updatedStreak,
          lastCompletedForStreak: today, // Always store the current full timestamp
        },
        { new: true }
      );
      
      return res.status(200).json({ updatedTask, updatedUser });
    }

    // If no XP was awarded, just send back the updated task
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
