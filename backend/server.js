const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "student_tracker",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// ===== CRUD IPK =====

// GET semua IPK
app.get("/api/ipk", (req, res) => {
  const sql = "SELECT * FROM ipk_history ORDER BY semester ASC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET IPK terbaru
app.get("/api/ipk/latest", (req, res) => {
  const sql = "SELECT * FROM ipk_history ORDER BY semester DESC LIMIT 1";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results[0] || null);
  });
});

// POST tambah IPK
app.post("/api/ipk", (req, res) => {
  const { semester, ipk } = req.body;
  if (!semester || ipk === undefined) {
    return res.status(400).json({ error: "Semester dan IPK wajib diisi" });
  }
  const sql = "INSERT INTO ipk_history (semester, ipk) VALUES (?, ?)";
  db.query(sql, [semester, ipk], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, semester, ipk });
  });
});

// PUT update IPK
app.put("/api/ipk/:id", (req, res) => {
  const { id } = req.params;
  const { semester, ipk } = req.body;
  const sql = "UPDATE ipk_history SET semester = ?, ipk = ? WHERE id = ?";
  db.query(sql, [semester, ipk, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "IPK berhasil diupdate" });
  });
});

// DELETE IPK
app.delete("/api/ipk/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM ipk_history WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "IPK berhasil dihapus" });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
