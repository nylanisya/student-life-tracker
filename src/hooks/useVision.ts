import { useState, useEffect } from "react";
import axios from "axios";

export interface VisionItem {
  id: string;
  title: string;
  category: string;
  timeline: "short-term" | "long-term";
  createdAt?: string;
}

const API_URL = "http://localhost:5000/api/visions";

export function useVision() {
  const [visionItems, setVisionItems] = useState<VisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisions = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching visions...");
      const response = await axios.get(API_URL);
      console.log("📊 Response visions:", response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        const parsedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          category: item.category,
          timeline: item.timeline || "short-term",
          createdAt: item.created_at,
        }));
        setVisionItems(parsedData);
        console.log("✅ Visions setelah di-parse:", parsedData);
      }
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
      console.log("📡 Adding vision:", vision);
      const response = await axios.post(API_URL, vision);
      console.log("📊 Response add vision:", response.data);
      if (response.data.success) {
        await fetchVisions();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error adding vision:", err);
      return false;
    }
  };

  const updateVision = async (id: string, vision: Partial<VisionItem>) => {
    try {
      console.log("📡 Updating vision:", id, vision);
      const response = await axios.put(`${API_URL}/${id}`, vision);
      console.log("📊 Response update vision:", response.data);
      if (response.data.success) {
        await fetchVisions();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error updating vision:", err);
      return false;
    }
  };

  const deleteVision = async (id: string) => {
    try {
      console.log("📡 Deleting vision:", id);
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log("📊 Response delete vision:", response.data);
      if (response.data.success) {
        await fetchVisions();
        return true;
      }
      return false;
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
