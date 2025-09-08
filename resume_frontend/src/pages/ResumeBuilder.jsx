import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial state matching Mongoose schema
  const [resume, setResume] = useState({
    title: "",
    personalDetails: { name: "", email: "", phone: "", address: "" },
    education: [{ institution: "", degree: "", startYear: "", endYear: "" }],
    experience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    skills: [""],
    projects: [{ title: "", description: "", link: "" }], // added projects
  });

  // Fetch resume if editing
  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:5000/api/resumes", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const existing = res.data.find((r) => r._id === id);
          if (existing) {
            setResume({
              title: existing.title || "",
              personalDetails: {
                name: existing.personalDetails?.name || "",
                email: existing.personalDetails?.email || "",
                phone: existing.personalDetails?.phone || "",
                address: existing.personalDetails?.address || "",
              },
              education:
                existing.education?.length > 0
                  ? existing.education
                  : [
                      {
                        institution: "",
                        degree: "",
                        startYear: "",
                        endYear: "",
                      },
                    ],
              experience:
                existing.experience?.length > 0
                  ? existing.experience
                  : [
                      {
                        company: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      },
                    ],
              skills: existing.skills?.length > 0 ? existing.skills : [""],
              projects:
                existing.projects?.length > 0
                  ? existing.projects
                  : [{ title: "", description: "", link: "" }], // added projects
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchResume();
    }
  }, [id]);

  // Handle personal details input
  const handlePersonalChange = (e) => {
    setResume({
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Handle array inputs (education, experience, skills, projects)
  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...resume[field]];
    if (key) {
      newArray[index][key] = value;
    } else {
      newArray[index] = value; // for skills
    }
    setResume({ ...resume, [field]: newArray });
  };

  // Add new entry to array
  const addArrayItem = (field, template) => {
    setResume({ ...resume, [field]: [...resume[field], template] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/resumes/${id}`, resume, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/resumes", resume, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Resume" : "Create Resume"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded space-y-4"
      >
        {/* Resume Title */}
        <input
          type="text"
          name="title"
          value={resume.title || ""}
          onChange={(e) => setResume({ ...resume, title: e.target.value })}
          placeholder="Resume Title"
          className="w-full border p-2 rounded"
        />

        {/* Personal Details */}
        <h3 className="font-semibold">Personal Details</h3>
        {["name", "email", "phone", "address"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            name={field}
            value={resume.personalDetails[field] || ""}
            onChange={handlePersonalChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 rounded"
          />
        ))}

        {/* Education */}
        <h3 className="font-semibold mt-4">Education</h3>
        {resume.education.map((edu, idx) => (
          <div key={idx} className="space-y-2">
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) =>
                handleArrayChange(
                  "education",
                  idx,
                  "institution",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) =>
                handleArrayChange("education", idx, "degree", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Start Year"
              value={edu.startYear || ""}
              onChange={(e) =>
                handleArrayChange("education", idx, "startYear", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              placeholder="End Year"
              value={edu.endYear || ""}
              onChange={(e) =>
                handleArrayChange("education", idx, "endYear", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addArrayItem("education", {
              institution: "",
              degree: "",
              startYear: "",
              endYear: "",
            })
          }
          className="bg-gray-200 px-3 py-1 rounded mt-1"
        >
          Add Education
        </button>

        {/* Experience */}
        <h3 className="font-semibold mt-4">Experience</h3>
        {resume.experience.map((exp, idx) => (
          <div key={idx} className="space-y-2">
            <input
              type="text"
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) =>
                handleArrayChange("experience", idx, "company", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={exp.role || ""}
              onChange={(e) =>
                handleArrayChange("experience", idx, "role", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={exp.startDate ? exp.startDate.substring(0, 10) : ""}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  idx,
                  "startDate",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              placeholder="End Date"
              value={exp.endDate ? exp.endDate.substring(0, 10) : ""}
              onChange={(e) =>
                handleArrayChange("experience", idx, "endDate", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={exp.description || ""}
              onChange={(e) =>
                handleArrayChange(
                  "experience",
                  idx,
                  "description",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addArrayItem("experience", {
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
          className="bg-gray-200 px-3 py-1 rounded mt-1"
        >
          Add Experience
        </button>

        {/* Skills */}
        <h3 className="font-semibold mt-4">Skills</h3>
        {resume.skills.map((skill, idx) => (
          <input
            key={idx}
            type="text"
            placeholder="Skill"
            value={skill || ""}
            onChange={(e) =>
              handleArrayChange("skills", idx, null, e.target.value)
            }
            className="w-full border p-2 rounded mb-1"
          />
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("skills", "")}
          className="bg-gray-200 px-3 py-1 rounded mt-1"
        >
          Add Skill
        </button>

        {/* Projects */}
        <h3 className="font-semibold mt-4">Projects</h3>
        {resume.projects.map((proj, idx) => (
          <div key={idx} className="space-y-2">
            <input
              type="text"
              placeholder="Project Title"
              value={proj.title || ""}
              onChange={(e) =>
                handleArrayChange("projects", idx, "title", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Project Description"
              value={proj.description || ""}
              onChange={(e) =>
                handleArrayChange(
                  "projects",
                  idx,
                  "description",
                  e.target.value
                )
              }
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Project Link"
              value={proj.link || ""}
              onChange={(e) =>
                handleArrayChange("projects", idx, "link", e.target.value)
              }
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addArrayItem("projects", { title: "", description: "", link: "" })
          }
          className="bg-gray-200 px-3 py-1 rounded mt-1"
        >
          Add Project
        </button>

        {/* Submit */}
        <button className="bg-blue-600 text-white w-full py-2 rounded mt-4">
          {id ? "Update Resume" : "Save Resume"}
        </button>
      </form>
    </div>
  );
}
