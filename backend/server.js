const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const rewardRoutes = require("./routes/rewardsRoutes");

dotenv.config();

// Set default environment variables if not provided
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

connectDB();

const app = express();
app.use(express.json());
app.use(cors()); 

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rewards", rewardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});