import { useState, useEffect } from "react";
import axios from "axios";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsedData = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        completed: item.completed === 1 || item.completed === true,
        createdAt: item.created_at,
      }));
      setTasks(parsedData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
      setError("Gagal mengambil data tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title: string) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, { title });
      await fetchTasks();
      return true;
    } catch (err) {
      console.error("❌ Error adding task:", err);
      return false;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return false;
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, {
        completed: !task.completed ? 1 : 0,
      });
      await fetchTasks();
      return true;
    } catch (err) {
      console.error("❌ Error toggling task:", err);
      return false;
    }
  };

  const updateTask = async (id: string, title: string) => {
    try {
      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, { title });
      await fetchTasks();
      return true;
    } catch (err) {
      console.error("❌ Error updating task:", err);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchTasks();
      return true;
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
