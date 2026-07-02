import { useState, useEffect } from "react";
import axios from "axios";

export interface Course {
  id: string;
  name: string;
  code: string;
  semester: number;
  progress: number;
  modules: number;
  completedModules: number;
  lastRead: string;
}

const API_URL = "http://localhost:5000/api/courses";

export function useCourseSummary() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Gagal mengambil data mata kuliah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ===== GETTER: Daftar nama mata kuliah untuk dropdown =====
  const getCourseNames = () => {
    return courses.map((c) => c.name);
  };

  // ===== CRUD =====
  const addCourse = async (course: Omit<Course, "id">) => {
    try {
      const response = await axios.post(API_URL, course);
      if (response.data.success) {
        await fetchCourses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding course:", err);
      return false;
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, course);
      if (response.data.success) {
        await fetchCourses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating course:", err);
      return false;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      if (response.data.success) {
        await fetchCourses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting course:", err);
      return false;
    }
  };

  return {
    courses,
    loading,
    error,
    getCourseNames,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: fetchCourses,
  };
}
