import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Rewards from "./pages/Rewards";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          
          {/* All protected routes go inside this single PrivateRoute wrapper */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard setUser={setUser} />} />
            <Route path="/rewards" element={<Rewards user={user} setUser={setUser} />} />
          </Route>

        </Routes>
      </main>
    </Router>
  );
}

export default App;
