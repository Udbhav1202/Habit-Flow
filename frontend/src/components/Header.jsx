import React from "react";
import { Link, useNavigate } from "react-router-dom";

// The component now accepts 'user' and 'setUser' as props
const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Clear the user state from App.jsx
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-400">
        <Link to="/">TaskQuest</Link>
      </div>
      <nav>
        <ul className="flex items-center space-x-6">
          {user ? (
            <>
              <li className="font-bold text-orange-400">🔥 Streak: {user.streak || 0}</li>
              <li className="font-bold text-green-400">XP: {user.xp || 0}</li>
              <li><Link to="/rewards" className="hover:text-blue-400">Rewards</Link></li>
              <li>Hello, {user.name}</li>
              <li>
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-blue-400">Login</Link></li>
              <li><Link to="/signup" className="hover:text-blue-400">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
