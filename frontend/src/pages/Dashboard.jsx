import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const API_URL = '/api/tasks/';

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = getToken();
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(API_URL, config);
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (tasks.length >= 3) {
      setError('You can only have 3 tasks per day. Focus!');
      return;
    }
    if (!title) {
      setError('Please enter a task title.');
      return;
    }
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.post(API_URL, { title }, config);
      setTasks([...tasks, response.data]);
      setTitle('');
      setError('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };
  
  // NEW: Function to toggle task completion
  const handleToggleComplete = async (task) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const updatedTask = await axios.put(
        API_URL + task._id,
        { completed: !task.completed }, // Send the opposite of the current status
        config
      );
      setTasks(
        tasks.map((t) => (t._id === task._id ? updatedTask.data : t))
      );
      // --- ADD THIS ENTIRE BLOCK ---
      // It checks if a task was just completed and updates the XP
      if (updatedTask.data.completed) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          user.xp = (user.xp || 0) + 10;
          localStorage.setItem('user', JSON.stringify(user));
          // This line is a simple way to tell other components (like the Header)
          // that the user data has changed.
          window.dispatchEvent(new Event('storage'));
        }
      }
      // -----------------------------
    } catch (err) {
        console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(API_URL + id, config);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-4">
        Your 3 Tasks for Today
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your next quest?"
            className="flex-grow p-3 border rounded-lg"
            disabled={tasks.length >= 3}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={tasks.length >= 3}
          >
            Add Task
          </button>
        </form>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className="h-6 w-6 accent-green-500"
                />
                <span
                  className={`text-lg ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-gray-400 hover:text-red-600 font-bold px-2"
              >
                ✕
              </button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-gray-500">No tasks yet. Add your first quest!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
