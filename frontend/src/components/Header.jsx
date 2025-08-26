import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const onLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        <Link to="/">TaskQuest</Link>
      </div>
      <nav>
        <ul className="flex items-center space-x-6">
          {user ? (
            <>
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
              <li>
                <Link to="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-600">
                  Sign Up
                </Link>
              </li>
              <li className="font-bold text-green-600">XP: 0</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
