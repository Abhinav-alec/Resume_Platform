import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Resumes</h2>
      <Link
        to="/resume-builder"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Create New Resume
      </Link>

      <div className="mt-4 space-y-2">
        {resumes.map((resume) => (
          <div
            key={resume._id}
            className="p-4 bg-white shadow rounded flex justify-between items-center"
          >
            <span>{resume.title || "Untitled Resume"}</span>
            <div>
              <button
                onClick={() => navigate(`/resume-view/${resume._id}`)}
                className="text-green-600 ml-4"
              >
                View
              </button>

              <Link
                to={`/resume-builder/${resume._id}`}
                className="text-blue-600 ml-4"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(resume._id)}
                className="text-red-600 ml-4"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
