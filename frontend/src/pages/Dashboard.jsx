import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ setUser }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State to manage which task is being edited
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const API_URL = '/api/tasks/';

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(API_URL, config);
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
      setIsLoading(false);
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
  
  const handleToggleComplete = async (taskToToggle) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.put(
        API_URL + taskToToggle._id,
        { completed: !taskToToggle.completed },
        config
      );
      const { updatedTask, updatedUser } = response.data;
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      if (updatedUser) {
        const userForStorage = { ...updatedUser, token: token };
        localStorage.setItem('user', JSON.stringify(userForStorage));
        setUser(userForStorage);
      }
    } catch (err) {
        console.error('Failed to update task:', err);
    }
  };

  // --- NEW --- Function to start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
  };

  // --- NEW --- Function to cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTitle('');
  };

  // --- NEW --- Function to save the edited task title
  const handleUpdateTitle = async (taskId) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.put(API_URL + taskId, { title: editedTitle }, config);
      const { updatedTask } = response.data;
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      cancelEditing(); // Exit editing mode
    } catch (err) {
      console.error('Failed to update task title:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Today's Quests
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={handleAddTask} className="flex gap-3 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your next quest?"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            disabled={tasks.length >= 3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Add
          </button>
        </form>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading quests...</p>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task._id} 
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg group"
              >
                {editingTaskId === task._id ? (
                  // --- EDITING VIEW ---
                  <div className="flex-grow flex items-center gap-2">
                    <input 
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button onClick={() => handleUpdateTitle(task._id)} className="bg-green-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-green-700">Save</button>
                    <button onClick={cancelEditing} className="bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                ) : (
                  // --- NORMAL VIEW ---
                  <>
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                        className="h-6 w-6 accent-green-500 cursor-pointer"
                      />
                      <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => startEditing(task)}
                      className="text-gray-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No quests for today. Add your first one!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
