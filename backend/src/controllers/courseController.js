const db = require("../config/db");

// GET semua courses
const getCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM courses ORDER BY semester ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST tambah course
const addCourse = async (req, res) => {
  const {
    name,
    code,
    semester,
    progress,
    modules,
    completedModules,
    lastRead,
  } = req.body;

  if (!name || !code || !semester) {
    return res.status(400).json({
      success: false,
      message: "Nama, Kode, dan Semester wajib diisi",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO courses (name, code, semester, progress, modules, completed_modules, last_read) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        code,
        semester,
        progress || 0,
        modules || 0,
        completedModules || 0,
        lastRead || null,
      ]
    );

    const [newRecord] = await db.query("SELECT * FROM courses WHERE id = ?", [
      result.insertId,
    ]);
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    code,
    semester,
    progress,
    modules,
    completedModules,
    lastRead,
  } = req.body;

  try {
    await db.query(
      "UPDATE courses SET name = ?, code = ?, semester = ?, progress = ?, modules = ?, completed_modules = ?, last_read = ? WHERE id = ?",
      [name, code, semester, progress, modules, completedModules, lastRead, id]
    );

    const [updated] = await db.query("SELECT * FROM courses WHERE id = ?", [
      id,
    ]);
    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE hapus course
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM courses WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
};
