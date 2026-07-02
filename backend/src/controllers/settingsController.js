const db = require("../config/db");

// GET semua settings
const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM settings");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update setting
const updateSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (!value) {
    return res
      .status(400)
      .json({ success: false, message: "Value wajib diisi" });
  }

  try {
    await db.query(
      "UPDATE settings SET value = ?, updated_at = NOW() WHERE key_name = ?",
      [value, key]
    );

    const [updated] = await db.query(
      "SELECT * FROM settings WHERE key_name = ?",
      [key]
    );
    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Setting tidak ditemukan" });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getSettings,
  updateSetting,
};
