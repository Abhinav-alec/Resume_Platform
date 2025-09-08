import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/dashboard" className="font-bold text-lg">
        Resume Platform
      </Link>
      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="px-3">
              Login
            </Link>
            <Link to="/signup" className="px-3">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
