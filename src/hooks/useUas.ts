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

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "uas_history";

export function useUas() {
  const [uasList, setUasList] = useState<UasRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsedData = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        mataKuliah: item.mata_kuliah,
        tanggal: item.tanggal,
        jam: item.jam || "-",
        ruangan: item.ruangan || "-",
        createdAt: item.created_at,
      }));
      setUasList(parsedData);
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
    return Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const upcomingUas =
    uasList.length > 0
      ? uasList
          .filter((item) => getDaysLeft(item.tanggal) >= 0)
          .sort((a, b) => getDaysLeft(a.tanggal) - getDaysLeft(b.tanggal))[0] ||
        uasList[0]
      : null;

  const addUas = async (
    mataKuliah: string,
    tanggal: string,
    jam: string,
    ruangan: string
  ) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, {
        mata_kuliah: mataKuliah,
        tanggal,
        jam,
        ruangan,
      });
      await fetchUas();
      return true;
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
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, {
        mata_kuliah: mataKuliah,
        tanggal,
        jam,
        ruangan,
      });
      await fetchUas();
      return true;
    } catch (err) {
      console.error("Error updating UAS:", err);
      return false;
    }
  };

  const deleteUas = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchUas();
      return true;
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
