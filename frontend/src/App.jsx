import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute"; // 1. Import PrivateRoute
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* 2. Wrap the Dashboard route in a PrivateRoute */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </main>
    </Router>
  );
}

export default App;
