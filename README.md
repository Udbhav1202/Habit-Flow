# 🚀 HabitFlow - A Gamified Task Manager

**HabitFlow** is a modern, full-stack MERN application designed to combat procrastination and task paralysis. By limiting users to **three essential quests per day**, it promotes focus and a sense of accomplishment.

This app is fully gamified, featuring **XP points**, **daily streaks**, and a **customizable rewards system** to keep users motivated and engaged.

---

## ✨ Live Demo

🌐 [Try HabitFlow Live](https://habit-flow-rho.vercel.app/)

---

## 🌟 Key Features

- 🎯 **Three Daily Quests**  
  Limit of 3 active tasks per day to boost focus and avoid overload.

- 🎮 **Gamification System**
  - **XP Points** – Earn 10 XP per completed quest.
  - **Daily Streaks** – Maintain streaks by completing at least one quest each day.

- 🎁 **Customizable Rewards**  
  Create your own real-life rewards and set XP costs to redeem them.

- 🛠️ **Full CRUD Functionality**  
  Add, edit, complete, and delete both tasks and rewards.

- 🔒 **Secure Authentication**  
  JWT-based user login and registration system.

- 📱 **Responsive Design**  
  Clean, minimalist UI optimized for both desktop and mobile devices.

---

## 💻 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (with Mongoose)  
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

---

## 🛠️ Getting Started – Run Locally

### ✅ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

---

### 📁 Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>

###Step 2: Install Dependencies
```Backend
cd backend
npm install

```Frontend
cd ../frontend
npm install

###Step 3: Configure Environment Variables
```Backend – Create a .env file in the backend folder:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

```Frontend – Create a .env file in the frontend folder:
VITE_API_URL=http://localhost:3000

###Step 4: Run the Application
Start Backend Server

From the backend directory:

node server.js

Start Frontend Dev Server

From the frontend directory:

npm run dev

🔗 App will be available at:

Frontend: http://localhost:5173

Backend API: http://localhost:3000

🧩 Project Structure
habitflow/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── .env
├── README.md
└── package.json

🧠 Troubleshooting Tips

If deployment fails with:

bash: nodemon: command not found
Exited with status 127


Do the following:

Change the backend start script in backend/package.json to use node:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


Make sure your .env files are correctly set up.

Ensure MongoDB is running locally or update your MONGO_URI to a cloud-hosted database.

🙌 Contributing

Contributions are welcome! If you'd like to fix a bug or add a feature:

Fork the repository

Create a new branch (git checkout -b feature-name)

Make your changes

Commit and push

Submit a pull request

📄 License

This project is licensed under the MIT License
.

👨‍💻 Author

Built with ❤️ by [Your Name]


---

### ✅ Final Reminder:

Before saving:
- Replace `<your-repository-url>` with your actual GitHub repo link
- Replace `[Your Name]` with your actual name or GitHub profile
- Ensure `.env` files are not committed (add to `.gitignore`)

Let me know if you'd like to include:
- Screenshots or a demo GIF
- GitHub badges
- Deployment instructions (e.g., Vercel + Render setup guide)

You're all set to ship a great README! 🚀
