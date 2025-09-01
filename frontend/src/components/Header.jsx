import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const homeLink = user ? "/dashboard" : "/";

  return (
    <header className="bg-white shadow-sm p-3 sm:p-4 flex justify-between items-center relative">
      <div className="text-xl font-bold">
        <Link to={homeLink} className="text-gray-800">TaskQuest</Link>
      </div>
      <nav>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <li><Link to="/rewards" className="text-gray-600 hover:text-blue-600">Rewards</Link></li>
              <li className="font-semibold text-orange-500">🔥 {user.streak || 0}</li>
              <li className="font-semibold text-green-500">{user.xp || 0} XP</li>
              <li className="text-gray-700">Hello, {user.name}</li>
              <li>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link></li>
              <li><Link to="/signup" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Sign Up</Link></li>
            </>
          )}
        </ul>

        {/* Mobile View */}
        <div className="md:hidden flex items-center space-x-4">
          {user ? (
            <>
              {/* Mobile Stats */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="font-semibold text-orange-500 text-sm sm:text-base">🔥 {user.streak || 0}</span>
                <span className="font-semibold text-green-500 text-sm sm:text-base">{user.xp || 0} XP</span>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 touch-manipulation"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          ) : (
             <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700">Sign Up</Link>
             </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && user && (
        <div className="absolute top-16 right-2 sm:right-4 bg-white shadow-lg rounded-lg p-4 w-40 sm:w-48 md:hidden z-50">
          <ul className="space-y-4">
            <li><Link to="/rewards" className="block text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Rewards</Link></li>
            <li>
              <button
                onClick={() => {
                  onLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;

