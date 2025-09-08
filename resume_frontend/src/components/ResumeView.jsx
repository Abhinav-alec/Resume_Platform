import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function ResumeView() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all resumes of logged-in user
        const res = await axios.get("http://localhost:5000/api/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Find the resume with matching id
        const foundResume = res.data.find((r) => r._id === resumeId);

        if (!foundResume) {
          console.error("Resume not found for this user");
        }

        setResume(foundResume || null);
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  if (loading) return <p>Loading resume...</p>;
  if (!resume) return <p>Resume not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">
        {resume.title || "Untitled Resume"}
      </h2>

      <div className="mb-4">
        <p>
          <strong>Name:</strong> {resume.personalDetails?.name}
        </p>
        <p>
          <strong>Email:</strong> {resume.personalDetails?.email}
        </p>
        <p>
          <strong>Phone:</strong> {resume.personalDetails?.phone}
        </p>
        <p>
          <strong>Address:</strong> {resume.personalDetails?.address}
        </p>
      </div>

      {/* Education */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold border-b pb-1 mb-2">Education</h3>
        <ul className="list-disc list-inside">
          {resume.education?.map((edu, i) => (
            <li key={i}>
              <span className="font-semibold">{edu.degree}</span> -{" "}
              {edu.institution} ({edu.startYear} - {edu.endYear})
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold border-b pb-1 mb-2">Experience</h3>
        {resume.experience?.map((exp, i) => (
          <div
            key={i}
            className="mb-2 p-2 border-l-4 border-blue-500 bg-blue-50 rounded"
          >
            <p className="font-semibold">
              {exp.role} @ {exp.company}
            </p>
            <p className="text-sm text-gray-600">
              {exp.startDate?.substring(0, 10)} -{" "}
              {exp.endDate?.substring(0, 10) || "Present"}
            </p>
            <p>{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h3>
        <p>{resume.skills?.join(", ")}</p>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h3>
        {resume.projects?.map((proj, i) => (
          <div
            key={i}
            className="mb-2 p-2 border-l-4 border-green-500 bg-green-50 rounded"
          >
            <p className="font-semibold">{proj.title}</p>
            <p>{proj.description}</p>
            {proj.link && (
              <p>
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Project Link
                </a>
              </p>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/dashboard"
        className="inline-block mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        ⬅ Back to Dashboard
      </Link>
    </div>
  );
}
