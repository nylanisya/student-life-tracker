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

const API_URL = "http://localhost:5000/api/sks";
const SETTINGS_URL = "http://localhost:5000/api/settings";

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
        axios.get(API_URL),
        axios.get(SETTINGS_URL),
      ]);

      let totalSks = 0;
      let lastSemester = 0;

      if (sksResponse.data.success && Array.isArray(sksResponse.data.data)) {
        const parsedData = sksResponse.data.data.map((item: any) => ({
          id: item.id.toString(),
          semester: item.semester,
          mataKuliah: item.mata_kuliah, // kolom di DB: mata_kuliah
          sks: item.sks,
          createdAt: item.created_at,
        }));
        setSksHistory(parsedData);

        totalSks = parsedData.reduce((sum, item) => sum + item.sks, 0);
        lastSemester =
          parsedData.length > 0
            ? Math.max(...parsedData.map((item) => item.semester))
            : 0;
      }

      let totalSksTarget = 144;
      if (
        settingsResponse.data.success &&
        Array.isArray(settingsResponse.data.data)
      ) {
        const totalSksSetting = settingsResponse.data.data.find(
          (item: any) => item.key_name === "total_sks_target"
        );
        if (totalSksSetting) {
          totalSksTarget = parseInt(totalSksSetting.value) || 144;
        }
      }

      setSummary({
        totalSksLulus: totalSks,
        totalSksTarget: totalSksTarget,
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
      const response = await axios.post(API_URL, {
        semester,
        mata_kuliah: mataKuliah,
        sks,
      });
      if (response.data.success) {
        await fetchSks();
        return true;
      }
      return false;
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
      const response = await axios.put(`${API_URL}/${id}`, {
        semester,
        mata_kuliah: mataKuliah,
        sks,
      });
      if (response.data.success) {
        await fetchSks();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating SKS:", err);
      return false;
    }
  };

  const deleteSks = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchSks();
        return true;
      }
      return false;
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
