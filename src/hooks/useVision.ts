import { useState, useEffect } from "react";
import axios from "axios";

export interface VisionItem {
  id: string;
  title: string;
  category: string;
  timeline: "short-term" | "long-term";
  createdAt?: string;
}

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "visions";

export function useVision() {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsedData = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        category: item.category,
        timeline: item.timeline || "short-term",
        createdAt: item.created_at,
      }));
      setVisionItems(parsedData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching visions:", err);
      setError("Gagal mengambil data visions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisions();
  }, []);

  const addVision = async (vision: Omit<VisionItem, "id">) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, vision);
      await fetchVisions();
      return true;
    } catch (err) {
      console.error("❌ Error adding vision:", err);
      return false;
    }
  };

  const updateVision = async (id: string, vision: Partial<VisionItem>) => {
    try {
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, vision);
      await fetchVisions();
      return true;
    } catch (err) {
      console.error("❌ Error updating vision:", err);
      return false;
    }
  };

  const deleteVision = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchVisions();
      return true;
    } catch (err) {
      console.error("❌ Error deleting vision:", err);
      return false;
    }
  };

  return {
    visionItems,
    loading,
    error,
    addVision,
    updateVision,
    deleteVision,
    refreshVisions: fetchVisions,
  };
}
