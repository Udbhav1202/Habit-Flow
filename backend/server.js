const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const rewardRoutes = require("./routes/rewardsRoutes"); 
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', 
  'https://habit-flow-rho.vercel.app',
  'https://habit-flow-cn9jnzqkq-udbhav1202s-projects.vercel.app',
  process.env.FRONTEND_URL // Add this to your environment variables
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// -------------------------

app.use(express.json());

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rewards", rewardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

