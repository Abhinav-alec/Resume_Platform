import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// A more comprehensive Icon component for better reusability
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

// SVG Paths for icons
const ICONS = {
  view: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  // --- THIS IS THE CORRECTED LINE ---
  edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  delete:
    "M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z",
  add: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
  document:
    "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
};

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ... (fetchResumes and handleDelete functions remain unchanged)
  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <p className="text-lg text-slate-500">Loading your masterpieces...</p>
        </div>
      );
    }

    if (resumes.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-dashed">
          <h3 className="text-2xl font-semibold text-slate-700">
            Your dashboard is empty
          </h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">
            Get started by creating your first professional resume. It only
            takes a few minutes!
          </p>
          <Link
            to="/resume-builder"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Create Your First Resume
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Create New Card */}
        <Link
          to="/resume-builder"
          className="group border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 min-h-[220px]"
        >
          <Icon
            path={ICONS.add}
            className="w-16 h-16 mb-2 text-slate-300 group-hover:text-blue-500 transition-colors"
          />
          <span className="font-semibold text-lg">Create New Resume</span>
        </Link>

        {/* Resume Cards */}
        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 min-h-[220px]"
          >
            <div className="h-1.5 bg-blue-600"></div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-start gap-3">
                <Icon
                  path={ICONS.document}
                  className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-800 break-words">
                    {resume.title || "Untitled Resume"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t flex justify-end items-center gap-2">
              <button
                onClick={() => navigate(`/resume-view/${resume._id}`)}
                className="p-2 rounded-full hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors"
                title="View"
              >
                <Icon path={ICONS.view} />
              </button>
              <Link
                to={`/resume-builder/${resume._id}`}
                className="p-2 rounded-full hover:bg-amber-100 text-slate-500 hover:text-amber-600 transition-colors"
                title="Edit"
              >
                <Icon path={ICONS.edit} />
              </Link>
              <button
                onClick={() => handleDelete(resume._id)}
                className="p-2 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Icon path={ICONS.delete} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Resume Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Manage, edit, and share your professional profiles with ease.
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
