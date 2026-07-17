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

const API_URL = "https://naylanisya.rf.gd/api.php";
const TABLE = "courses";

export function useCourseSummary() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}?table=${TABLE}`);
      const parsed = (response.data || []).map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        code: item.code,
        semester: item.semester,
        progress: item.progress,
        modules: item.modules,
        completedModules: item.completed_modules,
        lastRead: item.last_read,
      }));
      setCourses(parsed);
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

  const getCourseNames = () => courses.map((c) => c.name);

  const addCourse = async (course: Omit<Course, "id">) => {
    try {
      await axios.post(`${API_URL}?table=${TABLE}`, {
        name: course.name,
        code: course.code,
        semester: course.semester,
        progress: course.progress,
        modules: course.modules,
        completed_modules: course.completedModules,
        last_read: course.lastRead,
      });
      await fetchCourses();
      return true;
    } catch (err) {
      console.error("Error adding course:", err);
      return false;
    }
  };

  const updateCourse = async (id: string, course: Partial<Course>) => {
    try {
      const payload: any = {};
      if (course.name !== undefined) payload.name = course.name;
      if (course.code !== undefined) payload.code = course.code;
      if (course.semester !== undefined) payload.semester = course.semester;
      if (course.progress !== undefined) payload.progress = course.progress;
      if (course.modules !== undefined) payload.modules = course.modules;
      if (course.completedModules !== undefined)
        payload.completed_modules = course.completedModules;
      if (course.lastRead !== undefined) payload.last_read = course.lastRead;

      await axios.put(`${API_URL}?table=${TABLE}&id=${id}`, payload);
      await fetchCourses();
      return true;
    } catch (err) {
      console.error("Error updating course:", err);
      return false;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await axios.delete(`${API_URL}?table=${TABLE}&id=${id}`);
      await fetchCourses();
      return true;
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
