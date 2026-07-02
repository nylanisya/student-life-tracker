import { useState } from "react";
import { Task, Book, VisionItem, ScheduleItem } from "../types";

// Data contoh
const contohTasks: Task[] = [
  {
    id: "1",
    title: "Review modul 1",
    completed: false,
    dueDate: "2026-07-05",
    priority: "high",
  },
  {
    id: "2",
    title: "Kerjakan Tugas 1",
    completed: false,
    dueDate: "2026-07-10",
    priority: "medium",
  },
  {
    id: "3",
    title: "Baca chapter 3",
    completed: true,
    dueDate: "2026-06-28",
    priority: "low",
  },
];

const contohBooks: Book[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    progress: 75,
    status: "reading",
  },
  {
    id: "2",
    title: "The Hitchhiker's Guide",
    author: "Douglas Adams",
    progress: 100,
    status: "all-time-fav",
  },
  {
    id: "3",
    title: "Ghost Story",
    author: "Peter Straub",
    progress: 30,
    status: "reading",
  },
];

const contohVision: VisionItem[] = [
  {
    id: "1",
    title: "Having multiple income streams",
    category: "Finance & Wealth",
    timeline: "long-term",
  },
  {
    id: "2",
    title: "Career Growth",
    category: "Career & Growth",
    timeline: "short-term",
  },
];

const contohSchedule: ScheduleItem[] = [
  { id: "s1", title: "Tuton Session 1", type: "tuton", dueDate: "2026-07-02" },
  {
    id: "s2",
    title: "Tugas 1 Submission",
    type: "tugas1",
    dueDate: "2026-07-12",
  },
  {
    id: "s3",
    title: "Tugas 2 Submission",
    type: "tugas2",
    dueDate: "2026-07-26",
  },
  {
    id: "s4",
    title: "Tugas 3 Submission",
    type: "tugas3",
    dueDate: "2026-08-09",
  },
  { id: "s5", title: "Ujian Online (UO)", type: "uo", dueDate: "2026-08-20" },
];

export function useStudentData() {
  const [tasks, setTasks] = useState<Task[]>(contohTasks);
  const [books, setBooks] = useState<Book[]>(contohBooks);
  const [visionItems, setVisionItems] = useState<VisionItem[]>(contohVision);
  const [scheduleItems, setScheduleItems] =
    useState<ScheduleItem[]>(contohSchedule);

  // ===== TASK CRUD =====
  const addTask = (title: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // ===== VISION CRUD =====
  const addVision = (vision: Omit<VisionItem, "id">) => {
    const newVision = {
      ...vision,
      id: Date.now().toString(),
    };
    setVisionItems((prev) => [...prev, newVision]);
  };

  const updateVision = (id: string, vision: Partial<VisionItem>) => {
    setVisionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...vision } : item))
    );
  };

  const deleteVision = (id: string) => {
    setVisionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getUpcomingSchedule = () => {
    return [...scheduleItems].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  };

  return {
    tasks,
    books,
    visionItems,
    addTask,
    toggleTask,
    deleteTask,
    addVision,
    updateVision,
    deleteVision,
    getUpcomingSchedule,
  };
}
