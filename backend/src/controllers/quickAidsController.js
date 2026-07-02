const db = require("../config/db");

// GET data dari tabel tertentu
const getData = async (req, res) => {
  const { table } = req.params;

  const allowedTables = [
    "gratitudes",
    "reflections",
    "journals",
    "goals",
    "expenses",
  ];
  if (!allowedTables.includes(table)) {
    return res
      .status(400)
      .json({ success: false, message: "Table tidak valid" });
  }

  try {
    const [rows] = await db.query(
      `SELECT * FROM ${table} ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error getData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST data ke tabel tertentu
const addData = async (req, res) => {
  const { table } = req.params;
  const data = req.body;

  const allowedTables = [
    "gratitudes",
    "reflections",
    "journals",
    "goals",
    "expenses",
  ];
  if (!allowedTables.includes(table)) {
    return res
      .status(400)
      .json({ success: false, message: "Table tidak valid" });
  }

  try {
    // Bersihkan data: hapus field yang undefined/null
    const cleanData = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "") {
        cleanData[key] = value;
      }
    }

    // Untuk expenses, pastikan ada date
    if (table === "expenses" && !cleanData.date) {
      cleanData.date = new Date().toISOString().split("T")[0];
    }

    const keys = Object.keys(cleanData);
    const values = Object.values(cleanData);
    const placeholders = keys.map(() => "?").join(", ");

    const query = `INSERT INTO ${table} (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);

    const [newRecord] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [
      result.insertId,
    ]);
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error addData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update data
const updateData = async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;

  const allowedTables = [
    "gratitudes",
    "reflections",
    "journals",
    "goals",
    "expenses",
  ];
  if (!allowedTables.includes(table)) {
    return res
      .status(400)
      .json({ success: false, message: "Table tidak valid" });
  }

  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    await db.query(query, [...values, id]);

    const [updated] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [
      id,
    ]);
    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error updateData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE data dari tabel tertentu
const deleteData = async (req, res) => {
  const { table, id } = req.params;

  const allowedTables = [
    "gratitudes",
    "reflections",
    "journals",
    "goals",
    "expenses",
  ];
  if (!allowedTables.includes(table)) {
    return res
      .status(400)
      .json({ success: false, message: "Table tidak valid" });
  }

  try {
    const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getData,
  addData,
  updateData,
  deleteData,
};
