import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Rewards({ user, setUser }) {
  const [rewards, setRewards] = useState([]);
  const [newReward, setNewReward] = useState({ title: '', cost: '' });
  const [error, setError] = useState('');

  const API_URL = '/api/rewards/';

  const getToken = () => {
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    return userFromStorage ? userFromStorage.token : null;
  };

  useEffect(() => {
    const fetchRewards = async () => {
      const token = getToken();
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(API_URL, config);
        setRewards(response.data);
      } catch (err) {
        console.error('Failed to fetch rewards', err);
      }
    };
    fetchRewards();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReward({ ...newReward, [name]: value });
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    if (!newReward.title || !newReward.cost) {
      setError('Please enter a title and XP cost.');
      return;
    }
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const response = await axios.post(API_URL, newReward, config);
      setRewards([...rewards, response.data]);
      setNewReward({ title: '', cost: '' });
      setError('');
    } catch (err) {
      console.error('Failed to add reward', err);
    }
  };

  const handleRedeem = async (reward) => {
    if (user.xp < reward.cost) {
        alert("You don't have enough XP for this reward!");
        return;
    }
    const token = getToken();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
        const response = await axios.post(`${API_URL}redeem/${reward._id}`, {}, config);
        alert(response.data.message);
        
        const updatedUser = { ...user, xp: response.data.newXp };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (err) {
        console.error('Failed to redeem reward', err);
        alert(err.response.data.message);
    }
  };

  // NEW: Function to handle deleting a reward
  const handleDeleteReward = async (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
        const token = getToken();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            await axios.delete(API_URL + id, config);
            setRewards(rewards.filter((reward) => reward._id !== id));
        } catch (err) {
            console.error('Failed to delete reward', err);
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-4">Your Custom Rewards</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Create a New Reward</h2>
        <form onSubmit={handleAddReward} className="space-y-4">
          <input
            type="text" name="title" value={newReward.title} onChange={handleInputChange}
            placeholder="Reward Title (e.g., Watch a movie)"
            className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
          />
          <input
            type="number" name="cost" value={newReward.cost} onChange={handleInputChange}
            placeholder="XP Cost (e.g., 50)"
            className="w-full p-3 border rounded-lg bg-gray-700 border-gray-600"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600">
            Add Reward
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Redeem Rewards</h2>
        <div className="space-y-3">
          {rewards.length > 0 ? (
            rewards.map((reward) => (
              <div key={reward._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div>
                  <p className="text-lg">{reward.title}</p>
                  <p className="text-sm text-green-400">{reward.cost} XP</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!user || user.xp < reward.cost}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
                  >
                    Redeem
                  </button>
                  {/* Add the delete button */}
                  <button
                    onClick={() => handleDeleteReward(reward._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No rewards created yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rewards;
