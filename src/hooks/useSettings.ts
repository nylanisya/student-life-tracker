import { useState, useEffect } from "react";
import axios from "axios";

export interface Settings {
  totalSksTarget: number;
}

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ totalSksTarget: 144 });
  const [settingId, setSettingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const data = response.data || [];
      const totalSks = data.find(
        (item: any) => item.key_name === "total_sks_target"
      );
      if (totalSks) {
        setSettings({ totalSksTarget: parseInt(totalSks.value) || 144 });
        setSettingId(totalSks.id.toString());
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
    if (!settingId) return false;
    try {
      await axios.put(`${API_URL}?table=${TABLE}&id=${settingId}`, {
        value: value.toString(),
      });
      await fetchSettings();
      return true;
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
