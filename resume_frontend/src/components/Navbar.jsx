import React from "react";
import { Link, useNavigate } from "react-router-dom";

// A simple, reusable Icon component for our SVGs
const Icon = ({ path, className = "w-5 h-5", d, fillRule, clipRule }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule={fillRule} d={d || path} clipRule={clipRule} />
  </svg>
);

// SVG Paths
const ICONS = {
  logo: {
    d: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  },
  logout: {
    d: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  },
  user: {
    d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    fillRule: "evenodd",
    clipRule: "evenodd",
  },
};

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-900/10">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Brand/Logo */}
        <Link
          to={token ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 group"
        >
          <div className="p-1 rounded-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow duration-300">
            <Icon
              {...ICONS.logo}
              className="w-8 h-8 text-blue-600 transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Resume Platform
          </span>
        </Link>

        {/* Auth Links */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              <div className="p-2 rounded-full bg-slate-100">
                <Icon {...ICONS.user} className="w-5 h-5 text-slate-500" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 font-semibold px-4 py-2 rounded-lg border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 ease-out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>

              <div className="h-6 w-px bg-slate-200"></div>

              <Link
                to="/signup"
                className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:shadow-blue-500/40 hover:shadow-lg hover:-translate-y-px transition-all duration-300 ease-out"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
