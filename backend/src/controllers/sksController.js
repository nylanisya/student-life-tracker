const db = require("../config/db");

// GET semua SKS
const getSksHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sks_history ORDER BY semester ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST tambah SKS
const addSks = async (req, res) => {
  const { semester, mata_kuliah, sks } = req.body;

  if (!semester || !mata_kuliah || !sks) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Semester, Mata Kuliah, dan SKS wajib diisi",
      });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO sks_history (semester, mata_kuliah, sks, created_at) VALUES (?, ?, ?, NOW())",
      [semester, mata_kuliah, sks]
    );

    const [newRecord] = await db.query(
      "SELECT * FROM sks_history WHERE id = ?",
      [result.insertId]
    );
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update SKS
const updateSks = async (req, res) => {
  const { id } = req.params;
  const { semester, mata_kuliah, sks } = req.body;

  if (!semester || !mata_kuliah || !sks) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Semester, Mata Kuliah, dan SKS wajib diisi",
      });
  }

  try {
    await db.query(
      "UPDATE sks_history SET semester = ?, mata_kuliah = ?, sks = ?, created_at = NOW() WHERE id = ?",
      [semester, mata_kuliah, sks, id]
    );

    const [updated] = await db.query("SELECT * FROM sks_history WHERE id = ?", [
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

// DELETE hapus SKS
const deleteSks = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM sks_history WHERE id = ?", [
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
  getSksHistory,
  addSks,
  updateSks,
  deleteSks,
};
