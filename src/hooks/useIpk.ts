import { useState, useEffect } from "react";
import axios from "axios";

export interface IpkRecord {
  id: string;
  semester: number;
  value: number;
  createdAt: string;
}

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "ipk_history";

export function useIpk() {
  const [ipkHistory, setIpkHistory] = useState<IpkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIpk = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsedData = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        semester: item.semester,
        value: parseFloat(item.ipk),
        createdAt: item.created_at,
      }));
      setIpkHistory(parsedData);
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

  const currentIpk =
    ipkHistory.length > 0
      ? ipkHistory.reduce((latest, current) =>
          current.semester > latest.semester ? current : latest
        )
      : null;

  const previousIpk =
    ipkHistory.length > 1
      ? ipkHistory
          .filter((item) => item.semester < (currentIpk?.semester || 0))
          .reduce(
            (latest, current) =>
              current.semester > latest.semester ? current : latest,
            ipkHistory[0]
          )
      : null;

  const delta =
    currentIpk && previousIpk ? currentIpk.value - previousIpk.value : 0;

  const averageIpk =
    ipkHistory.length > 0
      ? ipkHistory.reduce((sum, item) => sum + item.value, 0) /
        ipkHistory.length
      : 0;

  const totalSemester = ipkHistory.length;

  const addIpk = async (semester: number, value: number) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, { semester, ipk: value });
      await fetchIpk();
      return true;
    } catch (err) {
      console.error("Error adding IPK:", err);
      return false;
    }
  };

  const updateIpk = async (id: string, semester: number, value: number) => {
    try {
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, {
        semester,
        ipk: value,
      });
      await fetchIpk();
      return true;
    } catch (err) {
      console.error("Error updating IPK:", err);
      return false;
    }
  };

  const deleteIpk = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchIpk();
      return true;
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
