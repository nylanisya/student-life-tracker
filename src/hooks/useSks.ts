import { useState, useEffect } from "react";
import axios from "axios";

export interface SksRecord {
  id: string;
  semester: number;
  mataKuliah: string;
  sks: number;
  createdAt: string;
}

export interface SksSummary {
  totalSksLulus: number;
  totalSksTarget: number;
  semesterTerakhir: number;
}

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "sks_history";

export function useSks() {
  const [sksHistory, setSksHistory] = useState<SksRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SksSummary>({
    totalSksLulus: 0,
    totalSksTarget: 144,
    semesterTerakhir: 0,
  });

  const fetchSks = async () => {
    try {
      setLoading(true);

      const [sksResponse, settingsResponse] = await Promise.all([
        axios.get(`${API_URL}?table=${TABLE}`),
        axios.get(`${API_URL}?table=settings`),
      ]);

      const parsedData = (sksResponse.data || []).map((item: any) => ({
        id: item.id.toString(),
        semester: item.semester,
        mataKuliah: item.mata_kuliah,
        sks: item.sks,
        createdAt: item.created_at,
      }));
      setSksHistory(parsedData);

      const totalSks = parsedData.reduce(
        (sum: number, item: SksRecord) => sum + item.sks,
        0
      );
      const lastSemester =
        parsedData.length > 0
          ? Math.max(...parsedData.map((item: SksRecord) => item.semester))
          : 0;

      let totalSksTarget = 144;
      const totalSksSetting = (settingsResponse.data || []).find(
        (item: any) => item.key_name === "total_sks_target"
      );
      if (totalSksSetting) {
        totalSksTarget = parseInt(totalSksSetting.value) || 144;
      }

      setSummary({
        totalSksLulus: totalSks,
        totalSksTarget,
        semesterTerakhir: lastSemester,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching SKS:", err);
      setError("Gagal mengambil data SKS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSks();
  }, []);

  const addSks = async (semester: number, mataKuliah: string, sks: number) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, {
        semester,
        mata_kuliah: mataKuliah,
        sks,
      });
      await fetchSks();
      return true;
    } catch (err) {
      console.error("Error adding SKS:", err);
      return false;
    }
  };

  const updateSks = async (
    id: string,
    semester: number,
    mataKuliah: string,
    sks: number
  ) => {
    try {
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, {
        semester,
        mata_kuliah: mataKuliah,
        sks,
      });
      await fetchSks();
      return true;
    } catch (err) {
      console.error("Error updating SKS:", err);
      return false;
    }
  };

  const deleteSks = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchSks();
      return true;
    } catch (err) {
      console.error("Error deleting SKS:", err);
      return false;
    }
  };

  return {
    sksHistory,
    summary,
    loading,
    error,
    addSks,
    updateSks,
    deleteSks,
    refreshSks: fetchSks,
  };
}
