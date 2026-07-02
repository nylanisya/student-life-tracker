const db = require("../config/db");

// GET semua vision
const getVisions = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM visions ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST tambah vision
const addVision = async (req, res) => {
  const { title, category, timeline } = req.body;

  if (!title || !category) {
    return res
      .status(400)
      .json({ success: false, message: "Title dan Category wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO visions (title, category, timeline) VALUES (?, ?, ?)",
      [title, category, timeline || "short-term"]
    );

    const [newRecord] = await db.query("SELECT * FROM visions WHERE id = ?", [
      result.insertId,
    ]);
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update vision
const updateVision = async (req, res) => {
  const { id } = req.params;
  const { title, category, timeline } = req.body;

  try {
    await db.query(
      "UPDATE visions SET title = ?, category = ?, timeline = ? WHERE id = ?",
      [title, category, timeline, id]
    );

    const [updated] = await db.query("SELECT * FROM visions WHERE id = ?", [
      id,
    ]);
    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vision tidak ditemukan" });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE hapus vision
const deleteVision = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM visions WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vision tidak ditemukan" });
    }
    res.json({ success: true, message: "Vision berhasil dihapus" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getVisions,
  addVision,
  updateVision,
  deleteVision,
};
