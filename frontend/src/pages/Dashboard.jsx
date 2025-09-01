import React, { useState, useEffect } from "react";
const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/tasks/`;
import axios from "axios";

const Dashboard = ({ setUser }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.token : null;
  };

  useEffect(() => {
    const initDashboard = async () => {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        await axios.post(`${API_URL}clear-completed`, {}, config);
        const response = await axios.get(API_URL, config);
        setTasks(response.data);
      } catch (err) {
        console.error("Failed to initialize dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initDashboard();
  }, []);

  const [isAddingTask, setIsAddingTask] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (tasks.filter(t => !t.completed).length >= 3) {
      setError('You can only have 3 active habits. Complete one first!');
      return;
    }
    if (!title) {
        setError("Please enter a habit title.");
        return;
    }
    
    setIsAddingTask(true);
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
        const response = await axios.post(API_URL, { title }, config);
        setTasks([...tasks, response.data]);
        setTitle('');
        setError('');
    } catch (err) {
        console.error('Failed to add task:', err);
        setError('Failed to add habit. Please try again.');
    } finally {
        setIsAddingTask(false);
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

  const handleEditTask = async (taskId) => {
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
        const response = await axios.put(API_URL + taskId, { title: editText }, config);
        const { updatedTask } = response.data;
        setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
        setEditingTask(null);
        setEditText('');
    } catch (err) {
        console.error('Failed to update task title:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
        const token = getToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.delete(API_URL + taskId, config);
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    }
  };


  return (
         <div className="max-w-xl mx-auto mt-4 sm:mt-8 p-3 sm:p-4">
         <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">Today's Quests</h1>
         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
             <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 mb-4">
                                 <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     placeholder="What's your next quest?"
                     className="flex-grow p-3 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 text-base"
                     disabled={tasks.filter(t => !t.completed).length >= 3}
                 />
                 <button
                     type="submit"
                     className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-base"
                     disabled={tasks.filter(t => !t.completed).length >= 3 || isAddingTask}
                 >
                     {isAddingTask ? 'Adding...' : 'Add'}
                 </button>
            </form>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="space-y-3 mt-4">
                 {isLoading ? (
                                         <p className="text-center text-gray-500">Loading habits...</p>
                 ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                                                 <div key={task._id} className="flex items-center justify-between bg-gray-50 p-3 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
                            {editingTask === task._id ? (
                                                                 // Edit Mode View
                                 <div className="flex-grow flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                                     <input 
                                         type="text"
                                         value={editText}
                                         onChange={(e) => setEditText(e.target.value)}
                                         className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
                                         autoFocus
                                     />
                                     <div className="flex gap-2">
                                         <button onClick={() => handleEditTask(task._id)} className="flex-1 sm:flex-none bg-green-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-green-700 text-sm">Save</button>
                                         <button onClick={() => setEditingTask(null)} className="flex-1 sm:flex-none bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg hover:bg-gray-300 text-sm">Cancel</button>
                                     </div>
                                 </div>
                            ) : (
                                // Normal View
                                <>
                                    <div className="flex items-center gap-4 flex-grow">
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
                                    <div className="flex items-center space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => { setEditingTask(task._id); setEditText(task.title); }} className="text-gray-400 hover:text-blue-600 p-2 sm:p-1 touch-manipulation">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-600 p-2 sm:p-1 touch-manipulation">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                                         <p className="text-center text-gray-500 py-4">No habits for today. Add your first one!</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;

