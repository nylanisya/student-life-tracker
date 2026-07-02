import { useState, useEffect } from "react";
import axios from "axios";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const API_URL = "http://localhost:5000/api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching tasks from:", API_URL);
      const response = await axios.get(API_URL);
      console.log("📊 Response tasks:", response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        const parsedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          completed: item.completed === 1 || item.completed === true,
          createdAt: item.created_at,
        }));
        setTasks(parsedData);
        console.log("✅ Tasks setelah di-parse:", parsedData);
      }
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
      console.log("📡 Adding task:", title);
      const response = await axios.post(API_URL, { title });
      console.log("📊 Response add task:", response.data);
      if (response.data.success) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error adding task:", err);
      return false;
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return false;
      console.log("📡 Toggling task:", id, "to", !task.completed);
      const response = await axios.put(`${API_URL}/${id}`, {
        completed: !task.completed,
      });
      if (response.data.success) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error toggling task:", err);
      return false;
    }
  };

  const updateTask = async (id: string, title: string) => {
    try {
      console.log("📡 Updating task:", id, "to", title);
      const response = await axios.put(`${API_URL}/${id}`, { title });
      if (response.data.success) {
        await fetchTasks();
        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Error updating task:", err);
      return false;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      console.log("📡 Deleting task:", id);
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchTasks();
        return true;
      }
      return false;
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
