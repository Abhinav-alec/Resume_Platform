import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// A simple Icon component for SVGs to keep the JSX clean
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  education:
    "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
  experience:
    "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
  skills: "M12 1l-10 5 10 5 10-5-10-5zm0 7.5l-10 5 10 5 10-5-10-5z",
  projects:
    "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z",
  add: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
  remove:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z",
};

// Reusable styled input component
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

// Reusable Section component
const FormSection = ({ icon, title, description, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-100 p-2 rounded-full">
        <Icon path={icon} className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- ALL YOUR EXISTING STATE AND LOGIC REMAINS UNCHANGED ---
  const [resume, setResume] = useState({
    title: "",
    personalDetails: { name: "", email: "", phone: "", address: "" },
    education: [{ institution: "", degree: "", startYear: "", endYear: "" }],
    experience: [
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ],
    skills: [""],
    projects: [{ title: "", description: "", link: "" }],
    versions: [],
  });

  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const token = localStorage.getItem("token");
          // Corrected to fetch the specific resume directly for editing
          const res = await axios.get(
            `http://localhost:5000/api/resumes/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const existing = res.data;
          if (existing) {
            setResume({
              title: existing.title || "",
              personalDetails: existing.personalDetails || {
                name: "",
                email: "",
                phone: "",
                address: "",
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
                  : [{ title: "", description: "", link: "" }],
              versions: existing.versions || [],
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchResume();
    }
  }, [id]);

  const handlePersonalChange = (e) => {
    setResume({
      ...resume,
      personalDetails: {
        ...resume.personalDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...resume[field]];
    if (key) {
      newArray[index][key] = value;
    } else {
      newArray[index] = value;
    }
    setResume({ ...resume, [field]: newArray });
  };

  const addArrayItem = (field, template) => {
    setResume({ ...resume, [field]: [...resume[field], template] });
  };

  // ADDED this function to support the "Remove" button
  const removeArrayItem = (field, index) => {
    const newArray = [...resume[field]];
    newArray.splice(index, 1);
    setResume({ ...resume, [field]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (id) {
        const res = await axios.get(`http://localhost:5000/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const existingResume = res.data;
        const version = {
          createdAt: new Date(),
          data: {
            title: existingResume.title,
            personalDetails: existingResume.personalDetails,
            education: existingResume.education,
            experience: existingResume.experience,
            skills: existingResume.skills,
            projects: existingResume.projects,
          },
        };
        await axios.put(
          `http://localhost:5000/api/resumes/${id}`,
          { ...resume, versions: [...(resume.versions || []), version] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {id ? "Edit Your Resume" : "Create Your Resume"}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Fill in the details below to generate a professional profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection
            icon={ICONS.user}
            title="Personal Details"
            description="Basic contact information."
          >
            <Input
              label="Resume Title"
              type="text"
              placeholder="e.g., Senior Frontend Developer Resume"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={resume.personalDetails.name}
                onChange={handlePersonalChange}
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={resume.personalDetails.email}
                onChange={handlePersonalChange}
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={resume.personalDetails.phone}
                onChange={handlePersonalChange}
              />
              <Input
                label="Address"
                type="text"
                name="address"
                placeholder="123 Main St, Anytown, USA"
                value={resume.personalDetails.address}
                onChange={handlePersonalChange}
              />
            </div>
          </FormSection>

          <FormSection
            icon={ICONS.education}
            title="Education"
            description="Your academic background and qualifications."
          >
            {resume.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md relative space-y-4 bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => removeArrayItem("education", idx)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full"
                >
                  {" "}
                  <Icon path={ICONS.remove} />{" "}
                </button>
                <Input
                  label="Institution"
                  placeholder="University of Example"
                  value={edu.institution}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      idx,
                      "institution",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="Degree"
                  placeholder="B.S. in Computer Science"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      idx,
                      "degree",
                      e.target.value
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Year"
                    type="number"
                    placeholder="2018"
                    value={edu.startYear}
                    onChange={(e) =>
                      handleArrayChange(
                        "education",
                        idx,
                        "startYear",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="End Year"
                    type="number"
                    placeholder="2022"
                    value={edu.endYear}
                    onChange={(e) =>
                      handleArrayChange(
                        "education",
                        idx,
                        "endYear",
                        e.target.value
                      )
                    }
                  />
                </div>
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
              className="flex items-center gap-2 font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {" "}
              <Icon path={ICONS.add} /> Add Education{" "}
            </button>
          </FormSection>

          <FormSection
            icon={ICONS.experience}
            title="Experience"
            description="Your professional work history."
          >
            {resume.experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md relative space-y-4 bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => removeArrayItem("experience", idx)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full"
                >
                  {" "}
                  <Icon path={ICONS.remove} />{" "}
                </button>
                <Input
                  label="Company"
                  placeholder="Tech Solutions Inc."
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      idx,
                      "company",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="Role"
                  placeholder="Software Engineer"
                  value={exp.role}
                  onChange={(e) =>
                    handleArrayChange("experience", idx, "role", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={exp.startDate ? exp.startDate.substring(0, 10) : ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        idx,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={exp.endDate ? exp.endDate.substring(0, 10) : ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "experience",
                        idx,
                        "endDate",
                        e.target.value
                      )
                    }
                  />
                </div>
                <Input
                  label="Description"
                  as="textarea"
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      idx,
                      "description",
                      e.target.value
                    )
                  }
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
              className="flex items-center gap-2 font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {" "}
              <Icon path={ICONS.add} /> Add Experience{" "}
            </button>
          </FormSection>

          <FormSection
            icon={ICONS.skills}
            title="Skills"
            description="List your key technical and soft skills."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {resume.skills.map((skill, idx) => (
                <div key={idx} className="relative">
                  <Input
                    placeholder="e.g., React.js"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("skills", idx, null, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("skills", idx)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 rounded-full"
                  >
                    {" "}
                    <Icon path={ICONS.remove} className="w-4 h-4" />{" "}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayItem("skills", "")}
              className="flex items-center gap-2 font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {" "}
              <Icon path={ICONS.add} /> Add Skill{" "}
            </button>
          </FormSection>

          <FormSection
            icon={ICONS.projects}
            title="Projects"
            description="Showcase your personal or professional projects."
          >
            {resume.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md relative space-y-4 bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => removeArrayItem("projects", idx)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full"
                >
                  {" "}
                  <Icon path={ICONS.remove} />{" "}
                </button>
                <Input
                  label="Project Title"
                  placeholder="My Awesome App"
                  value={proj.title}
                  onChange={(e) =>
                    handleArrayChange("projects", idx, "title", e.target.value)
                  }
                />
                <Input
                  label="Description"
                  placeholder="A brief description of your project."
                  value={proj.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      idx,
                      "description",
                      e.target.value
                    )
                  }
                />
                <Input
                  label="Link"
                  placeholder="https://github.com/user/repo"
                  value={proj.link}
                  onChange={(e) =>
                    handleArrayChange("projects", idx, "link", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addArrayItem("projects", {
                  title: "",
                  description: "",
                  link: "",
                })
              }
              className="flex items-center gap-2 font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {" "}
              <Icon path={ICONS.add} /> Add Project{" "}
            </button>
          </FormSection>
        </form>
      </div>

      {/* Sticky Footer for Actions */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-slate-900/10 py-3">
        <div className="container mx-auto max-w-4xl px-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg hover:-translate-y-px transition-all duration-300"
          >
            {id ? "Update Resume" : "Save Resume"}
          </button>
        </div>
      </div>
    </div>
  );
}
