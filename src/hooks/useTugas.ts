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

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "tugas_history";

export function useTugas() {
  const [tugasList, setTugasList] = useState<TugasRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTugas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsedData = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        mataKuliah: item.mata_kuliah,
        tugas: item.tugas,
        deadline: item.deadline,
        status: item.status || "pending",
        createdAt: item.created_at,
      }));
      setTugasList(parsedData);
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
    return Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const upcomingTugas =
    tugasList
      .filter((t) => t.status !== "selesai")
      .filter((t) => getDaysLeft(t.deadline) >= 0)
      .sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline))[0] ||
    null;

  const addTugas = async (
    mataKuliah: string,
    tugas: string,
    deadline: string
  ) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, {
        mata_kuliah: mataKuliah,
        tugas,
        deadline,
        status: "pending",
      });
      await fetchTugas();
      return true;
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
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, {
        mata_kuliah: mataKuliah,
        tugas,
        deadline,
        status,
      });
      await fetchTugas();
      return true;
    } catch (err) {
      console.error("Error updating Tugas:", err);
      return false;
    }
  };

  const deleteTugas = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchTugas();
      return true;
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
