const express = require('express');

const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});