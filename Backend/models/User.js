const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: String,
  personalDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  education: [
    {
      institution: String,
      degree: String,
      startYear: Number,
      endYear: Number,
    },
  ],
  experience: [
    {
      company: String,
      role: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  projects: [
    {
      title: String,
      description: String,
      link: String, // optional link to project or repository
    },
  ],
  skills: [String],
  versions: [
    {
      createdAt: { type: Date, default: Date.now },
      data: Object,
    },
  ],
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resumes: [resumeSchema],
});

module.exports = mongoose.model("User", userSchema);
