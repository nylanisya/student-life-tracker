const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const ipkRoutes = require("./routes/ipkRoutes");
const sksRoutes = require("./routes/sksRoutes");
const uasRoutes = require("./routes/uasRoutes");
const tugasRoutes = require("./routes/tugasRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const courseRoutes = require("./routes/courseRoutes");
const taskRoutes = require("./routes/taskRoutes");
const visionRoutes = require("./routes/visionRoutes"); // Tambahkan
const quickAidsRoutes = require("./routes/quickAidsRoutes");

app.use("/api/ipk", ipkRoutes);
app.use("/api/sks", sksRoutes);
app.use("/api/uas", uasRoutes);
app.use("/api/tugas", tugasRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/visions", visionRoutes); // Tambahkan
app.use("/api", quickAidsRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend berjalan! 🚀" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API IPK: http://localhost:${PORT}/api/ipk`);
  console.log(`📊 API SKS: http://localhost:${PORT}/api/sks`);
  console.log(`📊 API UAS: http://localhost:${PORT}/api/uas`);
  console.log(`📊 API Tugas: http://localhost:${PORT}/api/tugas`);
  console.log(`📊 API Settings: http://localhost:${PORT}/api/settings`);
  console.log(`📊 API Courses: http://localhost:${PORT}/api/courses`);
  console.log(`📊 API Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`📊 API Visions: http://localhost:${PORT}/api/visions`);
});
