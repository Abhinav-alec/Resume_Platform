const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all resumes of a user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.resumes);
  } catch (err) {
    console.error("Fetch all resumes error:", err);
    res.status(500).json({ message: err.message });
  }
});

// View single resume (like delete route)
router.get("/:resumeId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find resume manually in the array
    const resume = user.resumes.find(
      (r) => r._id.toString() === req.params.resumeId
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.json(resume);
  } catch (err) {
    console.error("Fetch single resume error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Add a new resume
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.resumes.push(req.body);
    await user.save();
    res.json(user.resumes);
  } catch (err) {
    console.error("Add resume error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update a resume
router.put("/:resumeId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const resume = user.resumes.id(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    Object.assign(resume, req.body);
    await user.save();
    res.json(resume);
  } catch (err) {
    console.error("Update resume error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a resume
router.delete("/:resumeId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const resumeIndex = user.resumes.findIndex(
      (r) => r._id.toString() === req.params.resumeId
    );
    if (resumeIndex === -1)
      return res.status(404).json({ message: "Resume not found" });

    user.resumes.splice(resumeIndex, 1);
    await user.save();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Delete resume error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
