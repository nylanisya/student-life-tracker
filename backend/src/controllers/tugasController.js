const db = require("../config/db");

const getTugasList = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tugas_history ORDER BY deadline ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addTugas = async (req, res) => {
  const { mata_kuliah, tugas, deadline, status } = req.body;

  if (!mata_kuliah || !tugas || !deadline) {
    return res.status(400).json({
      success: false,
      message: "Mata Kuliah, Tugas, dan Deadline wajib diisi",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO tugas_history (mata_kuliah, tugas, deadline, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [mata_kuliah, tugas, deadline, status || "pending"]
    );

    const [newRecord] = await db.query(
      "SELECT * FROM tugas_history WHERE id = ?",
      [result.insertId]
    );
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateTugas = async (req, res) => {
  const { id } = req.params;
  const { mata_kuliah, tugas, deadline, status } = req.body;

  if (!mata_kuliah || !tugas || !deadline) {
    return res.status(400).json({
      success: false,
      message: "Mata Kuliah, Tugas, dan Deadline wajib diisi",
    });
  }

  try {
    await db.query(
      "UPDATE tugas_history SET mata_kuliah = ?, tugas = ?, deadline = ?, status = ?, created_at = NOW() WHERE id = ?",
      [mata_kuliah, tugas, deadline, status || "pending", id]
    );

    const [updated] = await db.query(
      "SELECT * FROM tugas_history WHERE id = ?",
      [id]
    );
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

const deleteTugas = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tugas_history WHERE id = ?", [
      id,
    ]);
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
  getTugasList,
  addTugas,
  updateTugas,
  deleteTugas,
};
