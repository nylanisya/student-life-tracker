const db = require('../config/db');
// GET semua IPK
const getIpkHistory = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ipk_history ORDER BY semester ASC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// GET IPK terbaru
const getCurrentIpk = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ipk_history ORDER BY semester DESC LIMIT 1');
    if (rows.length === 0) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// POST tambah IPK
const addIpk = async (req, res) => {
  const { semester, ipk } = req.body;
  if (!semester || ipk === undefined || ipk === null) {
    return res.status(400).json({ success: false, message: 'Semester dan IPK wajib diisi' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO ipk_history (semester, ipk, created_at) VALUES (?, ?, NOW())',
      [semester, ipk]
    );
    const [newRecord] = await db.query('SELECT * FROM ipk_history WHERE id = ?', [result.insertId]);
    res.json({ success: true, data: newRecord[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// PUT update IPK
const updateIpk = async (req, res) => {
  const { id } = req.params;
  const { semester, ipk } = req.body;
  if (!semester || ipk === undefined || ipk === null) {
    return res.status(400).json({ success: false, message: 'Semester dan IPK wajib diisi' });
  }
  try {
    await db.query(
      'UPDATE ipk_history SET semester = ?, ipk = ?, created_at = NOW() WHERE id = ?',
      [semester, ipk, id]
    );
    const [updated] = await db.query('SELECT * FROM ipk_history WHERE id = ?', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// DELETE hapus IPK
const deleteIpk = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM ipk_history WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports = {
  getIpkHistory,
  getCurrentIpk,
  addIpk,
  updateIpk,
  deleteIpk,
};
