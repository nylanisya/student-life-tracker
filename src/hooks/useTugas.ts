import { useState, useEffect } from "react";
import axios from "axios";

export interface TugasRecord {
  id: string;
  mataKuliah: string;
  tugas: string;
  deadline: string;
  status: "pending" | "selesai";
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/tugas";

export function useTugas() {
  const [tugasList, setTugasList] = useState<TugasRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTugas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      console.log("📊 Data Tugas dari DB:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        // Mapping data dari database
        const parsedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          mataKuliah: item.mata_kuliah, // kolom di DB: mata_kuliah
          tugas: item.tugas,
          deadline: item.deadline,
          status: item.status || "pending",
          createdAt: item.created_at,
        }));
        setTugasList(parsedData);
        console.log("✅ Data Tugas setelah di-parse:", parsedData);
      }
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching Tugas:", err);
      setError("Gagal mengambil data Tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const getDaysLeft = (date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  // Tugas terdekat (belum selesai, deadline terdekat)
  const upcomingTugas =
    tugasList
      .filter((t) => t.status !== "selesai")
      .filter((t) => getDaysLeft(t.deadline) >= 0)
      .sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline))[0] ||
    null;

  console.log("📌 Upcoming Tugas:", upcomingTugas);

  // CRUD
  const addTugas = async (
    mataKuliah: string,
    tugas: string,
    deadline: string
  ) => {
    try {
      const response = await axios.post(API_URL, {
        mata_kuliah: mataKuliah,
        tugas,
        deadline,
        status: "pending",
      });
      if (response.data.success) {
        await fetchTugas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding Tugas:", err);
      return false;
    }
  };

  const updateTugas = async (
    id: string,
    mataKuliah: string,
    tugas: string,
    deadline: string,
    status: string
  ) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        mata_kuliah: mataKuliah,
        tugas,
        deadline,
        status,
      });
      if (response.data.success) {
        await fetchTugas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating Tugas:", err);
      return false;
    }
  };

  const deleteTugas = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchTugas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting Tugas:", err);
      return false;
    }
  };

  return {
    tugasList,
    upcomingTugas,
    getDaysLeft,
    loading,
    error,
    addTugas,
    updateTugas,
    deleteTugas,
    refreshTugas: fetchTugas,
  };
}
