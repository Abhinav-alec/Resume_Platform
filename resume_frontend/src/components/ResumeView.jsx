import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function ResumeView() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  // ✅ Date formatters
  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  };

  const formatDateOnly = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(d);
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/resumes/${resumeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResume(res.data || null);
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleDownloadPDF = () => {
    setPdfLoading(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let y = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - 40;

      const addPageIfNeeded = (neededHeight) => {
        if (y + neededHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      };

      const renderText = (
        text,
        fontStyle = "normal",
        fontSize = 10,
        x = 20,
        color = [0, 0, 0],
        align = "left"
      ) => {
        doc.setFont("helvetica", fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        doc.text(text, x, y, { align });
        y += fontSize * 0.7;
      };

      // --- Top Heading (Name / Resume Title) ---
      renderText(
        resume.title || "Untitled Resume",
        "bold",
        18,
        20,
        [10, 10, 10]
      );

      // --- Personal Details ---
      if (resume.personalDetails) {
        y += 2;
        renderText("Personal Details", "bold", 12, 20, [30, 30, 30]);
        const details = [
          `Name: ${resume.personalDetails.name || ""}`,
          `Email: ${resume.personalDetails.email || ""}`,
          `Phone: ${resume.personalDetails.phone || ""}`,
          `Address: ${resume.personalDetails.address || ""}`,
        ];
        details.forEach((line) =>
          renderText(line, "normal", 10, 20, [50, 50, 50])
        );
        y += 2;
      }

      // --- Education ---
      if (resume.education?.length) {
        renderText("Education", "bold", 12, 20, [30, 30, 30]);
        resume.education.forEach((edu) => {
          addPageIfNeeded(6);
          renderText(
            `${edu.degree} - ${edu.institution} (${edu.startYear} - ${edu.endYear})`,
            "normal",
            10,
            20,
            [50, 50, 50]
          );
        });
        y += 2;
      }

      // --- Experience ---
      if (resume.experience?.length) {
        renderText("Experience", "bold", 12, 20, [30, 30, 30]);
        resume.experience.forEach((exp) => {
          addPageIfNeeded(8);
          renderText(`${exp.role} @ ${exp.company}`, "bold", 11, 20, [0, 0, 0]);
          const dateText = `${formatDateOnly(exp.startDate)} - ${
            exp.endDate ? formatDateOnly(exp.endDate) : "Present"
          }`;
          renderText(
            dateText,
            "italic",
            9,
            pageWidth - 20,
            [100, 100, 100],
            "right"
          );

          const descriptionLines = doc.splitTextToSize(
            exp.description || "",
            contentWidth - 8
          );
          descriptionLines.forEach((line) => {
            addPageIfNeeded(5);
            renderText(`• ${line}`, "normal", 10, 28, [50, 50, 50]);
          });
          y += 2;
        });
      }

      // --- Skills ---
      if (resume.skills?.length) {
        addPageIfNeeded(6);
        renderText("Skills", "bold", 12, 20, [30, 30, 30]);
        const skillsText = resume.skills.join(", ");
        const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
        skillsLines.forEach((line) => {
          addPageIfNeeded(5);
          renderText(line, "normal", 10, 20, [50, 50, 50]);
        });
        y += 2;
      }

      // --- Projects ---
      if (resume.projects?.length) {
        resume.projects.forEach((proj) => {
          addPageIfNeeded(8);
          renderText("Project", "bold", 12, 20, [30, 30, 30]);
          renderText(proj.title || "", "bold", 11, 20, [0, 0, 0]);
          const projectDescription = doc.splitTextToSize(
            proj.description || "",
            contentWidth
          );
          projectDescription.forEach((line) => {
            addPageIfNeeded(5);
            renderText(line, "normal", 10, 20, [50, 50, 50]);
          });
          if (proj.link) {
            addPageIfNeeded(6);
            doc.setTextColor(0, 0, 255);
            doc.textWithLink("Project Link", 20, y, { url: proj.link });
            doc.setTextColor(0, 0, 0);
            y += 8;
          }
        });
      }

      // --- Created / Updated Dates ---
      y += 6;
      renderText(
        `Created At: ${formatDateTime(resume.createdAt)}`,
        "italic",
        9
      );
      renderText(
        `Updated At: ${formatDateOnly(resume.updatedAt)}`,
        "italic",
        9
      );

      doc.save(`${resume.title || "resume"}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <p>Loading resume...</p>;
  if (!resume) return <p>Resume not found.</p>;

  return (
    <div>
      {/* Resume content wrapper */}
      <div
        id="resume-content"
        className="p-6 max-w-3xl mx-auto bg-white shadow rounded"
      >
        <h2 className="text-3xl font-bold mb-4">
          {resume.title || "Untitled Resume"}
        </h2>

        {/* Personal Details */}
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
          <h3 className="text-xl font-semibold border-b pb-1 mb-2">
            Education
          </h3>
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
          <h3 className="text-xl font-semibold border-b pb-1 mb-2">
            Experience
          </h3>
          {resume.experience?.map((exp, i) => (
            <div
              key={i}
              className="mb-2 p-2 border-l-4 border-blue-500 bg-blue-50 rounded"
            >
              <p className="font-semibold">
                {exp.role} @ {exp.company}
              </p>
              <p className="text-sm text-gray-600">
                {formatDateOnly(exp.startDate)} -{" "}
                {exp.endDate ? formatDateOnly(exp.endDate) : "Present"}
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

        {/* Created/Updated Info */}
        <div className="mt-4 text-sm text-gray-500">
          <p>Created At: {formatDateTime(resume.createdAt)}</p>
          <p>Updated At: {formatDateOnly(resume.updatedAt)}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 max-w-3xl mx-auto">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={pdfLoading}
        >
          {pdfLoading ? "Generating PDF..." : "📄 Download PDF"}
        </button>

        <Link
          to="/dashboard"
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ⬅ Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
