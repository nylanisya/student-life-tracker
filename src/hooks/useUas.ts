import { useState, useEffect } from "react";
import axios from "axios";

export interface UasRecord {
  id: string;
  mataKuliah: string;
  tanggal: string;
  jam: string;
  ruangan: string;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/uas";

export function useUas() {
  const [uasList, setUasList] = useState<UasRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      console.log("📊 Data UAS dari DB:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        // Mapping data dari database
        const parsedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          mataKuliah: item.mata_kuliah, // kolom di DB: mata_kuliah
          tanggal: item.tanggal,
          jam: item.jam || "-",
          ruangan: item.ruangan || "-",
          createdAt: item.created_at,
        }));
        setUasList(parsedData);
        console.log("✅ Data UAS setelah di-parse:", parsedData);
      }
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching UAS:", err);
      setError("Gagal mengambil data UAS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUas();
  }, []);

  const getDaysLeft = (date: string) => {
    const now = new Date();
    const target = new Date(date);
    const diff = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  // UAS terdekat
  const upcomingUas =
    uasList.length > 0
      ? uasList
          .filter((item) => getDaysLeft(item.tanggal) >= 0)
          .sort((a, b) => getDaysLeft(a.tanggal) - getDaysLeft(b.tanggal))[0] ||
        uasList[0]
      : null;

  console.log("📌 Upcoming UAS:", upcomingUas);

  // CRUD
  const addUas = async (
    mataKuliah: string,
    tanggal: string,
    jam: string,
    ruangan: string
  ) => {
    try {
      const response = await axios.post(API_URL, {
        mata_kuliah: mataKuliah,
        tanggal,
        jam,
        ruangan,
      });
      if (response.data.success) {
        await fetchUas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding UAS:", err);
      return false;
    }
  };

  const updateUas = async (
    id: string,
    mataKuliah: string,
    tanggal: string,
    jam: string,
    ruangan: string
  ) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        mata_kuliah: mataKuliah,
        tanggal,
        jam,
        ruangan,
      });
      if (response.data.success) {
        await fetchUas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating UAS:", err);
      return false;
    }
  };

  const deleteUas = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchUas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting UAS:", err);
      return false;
    }
  };

  return {
    uasList,
    upcomingUas,
    getDaysLeft,
    loading,
    error,
    addUas,
    updateUas,
    deleteUas,
    refreshUas: fetchUas,
  };
}
