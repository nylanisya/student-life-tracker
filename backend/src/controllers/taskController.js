const db = require("../config/db");

// GET semua tasks
const getTasks = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST tambah task
const addTask = async (req, res) => {
  const { title } = req.body;
  console.log("📝 Received title:", title);

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: "Title wajib diisi" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO tasks (title, completed) VALUES (?, ?)",
      [title, false]
    );

    const [newRecord] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    console.log("✅ Task added:", newRecord);
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    let query = "UPDATE tasks SET ";
    const params = [];

    if (title !== undefined) {
      query += "title = ?, ";
      params.push(title);
    }
    if (completed !== undefined) {
      query += "completed = ?, ";
      params.push(completed);
    }

    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    await db.query(query, params);

    const [updated] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task tidak ditemukan" });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE hapus task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task tidak ditemukan" });
    }
    res.json({ success: true, message: "Task berhasil dihapus" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};
