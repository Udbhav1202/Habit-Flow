HabitFlow - A Gamified Task Manager
HabitFlow is a modern, full-stack MERN application designed to combat procrastination and task paralysis. By limiting users to three essential quests per day, it promotes focus and a sense of accomplishment. The app is fully gamified, featuring XP, daily streaks, and a customizable rewards system to keep users motivated and engaged.

Live Application
You can view and use the live, deployed application here:

https://habit-flow-rho.vercel.app/
Key Features
Three Daily Quests: Enforces focus by limiting the user to a maximum of three active tasks per day.

Gamification System:

XP Points: Earn 10 XP for every completed quest.

Daily Streaks: Maintain a streak by completing at least one quest every day.

Customizable Rewards: Create your own real-life rewards and set an XP cost to redeem them.

Full CRUD Functionality: Add, complete, edit, and delete tasks and rewards.

Secure Authentication: Full user registration and login system using JWT for secure sessions.

Responsive Design: A clean, minimalist UI that works seamlessly on desktop and mobile devices.

Tech Stack
Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express

Database: MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT), bcryptjs

Running the Project Locally
To run this project on your own machine, you will need to have Node.js and MongoDB installed.

Clone the repository:

git clone <your-repository-url>
cd <your-project-folder>

Install Backend Dependencies:

cd backend
npm install

Install Frontend Dependencies:

cd ../frontend
npm install

Set Up Environment Variables:

In the backend folder, create a .env file and add your MONGO_URI and JWT_SECRET.

In the frontend folder, create a .env file and add VITE_API_URL=http://localhost:3000.

Run the Servers:

Backend: In one terminal, from the /backend directory, run:

node server.js

Frontend: In a separate terminal, from the /frontend directory, run:

npm run dev
