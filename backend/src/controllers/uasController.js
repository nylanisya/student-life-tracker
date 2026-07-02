const db = require("../config/db");

const getUasList = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM uas_history ORDER BY tanggal ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addUas = async (req, res) => {
  const { mata_kuliah, tanggal, jam, ruangan } = req.body;

  if (!mata_kuliah || !tanggal) {
    return res
      .status(400)
      .json({ success: false, message: "Mata Kuliah dan Tanggal wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO uas_history (mata_kuliah, tanggal, jam, ruangan, created_at) VALUES (?, ?, ?, ?, NOW())",
      [mata_kuliah, tanggal, jam || "-", ruangan || "-"]
    );

    const [newRecord] = await db.query(
      "SELECT * FROM uas_history WHERE id = ?",
      [result.insertId]
    );
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateUas = async (req, res) => {
  const { id } = req.params;
  const { mata_kuliah, tanggal, jam, ruangan } = req.body;

  if (!mata_kuliah || !tanggal) {
    return res
      .status(400)
      .json({ success: false, message: "Mata Kuliah dan Tanggal wajib diisi" });
  }

  try {
    await db.query(
      "UPDATE uas_history SET mata_kuliah = ?, tanggal = ?, jam = ?, ruangan = ?, created_at = NOW() WHERE id = ?",
      [mata_kuliah, tanggal, jam || "-", ruangan || "-", id]
    );

    const [updated] = await db.query("SELECT * FROM uas_history WHERE id = ?", [
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

const deleteUas = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM uas_history WHERE id = ?", [
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
  getUasList,
  addUas,
  updateUas,
  deleteUas,
};
