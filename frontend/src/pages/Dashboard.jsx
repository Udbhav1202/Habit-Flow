import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Accept setUser as a prop
function Dashboard({ setUser }) {
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
  
  const handleToggleComplete = async (task) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const updatedTask = await axios.put(
        API_URL + task._id,
        { completed: !task.completed },
        config
      );
      setTasks(
        tasks.map((t) => (t._id === task._id ? updatedTask.data : t))
      );

      // 2. This is the new, improved logic for updating global state
      if (updatedTask.data.completed) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          // Note: We are now also updating the streak in the local object
          const updatedUser = { 
            ...currentUser, 
            xp: (currentUser.xp || 0) + 10,
            streak: currentUser.streak // This will be updated on the next login
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser); // This updates the state in App.jsx!
        }
      }
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
    <div className="max-w-2xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-4">
        Your 3 Tasks for Today
      </h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your next quest?"
            className="flex-grow p-3 border rounded-lg bg-gray-700 border-gray-600"
            disabled={tasks.length >= 3}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-500"
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
              className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
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
                    task.completed ? 'line-through text-gray-500' : ''
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
