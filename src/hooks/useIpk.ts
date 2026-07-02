import { useState, useEffect } from "react";
import axios from "axios";

export interface IpkRecord {
  id: string;
  semester: number;
  value: number;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/ipk";

export function useIpk() {
  const [ipkHistory, setIpkHistory] = useState<IpkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIpk = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success && Array.isArray(response.data.data)) {
        const parsedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          semester: item.semester,
          value: parseFloat(item.ipk),
          createdAt: item.created_at,
        }));
        setIpkHistory(parsedData);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching IPK:", err);
      setError("Gagal mengambil data IPK");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpk();
  }, []);

  // ===== KALKULASI =====

  // 1. IPS terbaru (nilai semester terakhir)
  const currentIpk =
    ipkHistory.length > 0
      ? ipkHistory.reduce((latest, current) =>
          current.semester > latest.semester ? current : latest
        )
      : null;

  // 2. IPS sebelumnya (semester kedua terakhir)
  const previousIpk =
    ipkHistory.length > 1
      ? ipkHistory
          .filter((item) => item.semester < (currentIpk?.semester || 0))
          .reduce((latest, current) =>
            current.semester > latest.semester ? current : latest
          )
      : null;

  // 3. Delta (selisih IPS terakhir dengan sebelumnya)
  const delta =
    currentIpk && previousIpk ? currentIpk.value - previousIpk.value : 0;

  // 4. IPK (rata-rata dari semua IPS)
  const averageIpk =
    ipkHistory.length > 0
      ? ipkHistory.reduce((sum, item) => sum + item.value, 0) /
        ipkHistory.length
      : 0;

  // 5. Jumlah semester
  const totalSemester = ipkHistory.length;

  // ===== CRUD =====
  const addIpk = async (semester: number, value: number) => {
    try {
      const response = await axios.post(API_URL, { semester, ipk: value });
      if (response.data.success) {
        await fetchIpk();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding IPK:", err);
      return false;
    }
  };

  const updateIpk = async (id: string, semester: number, value: number) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        semester,
        ipk: value,
      });
      if (response.data.success) {
        await fetchIpk();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating IPK:", err);
      return false;
    }
  };

  const deleteIpk = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchIpk();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting IPK:", err);
      return false;
    }
  };

  return {
    ipkHistory,
    currentIpk,
    previousIpk,
    delta,
    averageIpk,
    totalSemester,
    loading,
    error,
    addIpk,
    updateIpk,
    deleteIpk,
    refreshIpk: fetchIpk,
  };
}
