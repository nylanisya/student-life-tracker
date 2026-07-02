import { useState, useEffect } from "react";
import axios from "axios";

export interface Settings {
  totalSksTarget: number;
}

const API_URL = "http://localhost:5000/api/settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    totalSksTarget: 144,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success) {
        const data = response.data.data;
        const totalSks = data.find(
          (item: any) => item.key_name === "total_sks_target"
        );
        if (totalSks) {
          setSettings({
            totalSksTarget: parseInt(totalSks.value) || 144,
          });
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Gagal mengambil pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const updateTotalSks = async (value: number) => {
    try {
      const response = await axios.put(`${API_URL}/total_sks_target`, {
        value: value.toString(),
      });
      if (response.data.success) {
        await fetchSettings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating total SKS:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    updateTotalSks,
    refreshSettings: fetchSettings,
  };
}
