import React, { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useStudentData } from "../hooks/useStudentData";

const TaskManager: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useStudentData();
  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    // Kirim hanya string title, karena addTask hanya menerima string
    addTask(newTask.trim());
    setNewTask("");
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Check size={18} className="text-pink-500" />
          Today's Tasks
        </h3>
        <span className="text-xs text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
          {tasks.filter((t) => t.completed).length}/{tasks.length}
        </span>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-3 shrink-0">
        <input
          type="text"
          placeholder="Add task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl hover:opacity-90 transition shrink-0"
        >
          <Plus size={16} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-2.5 p-2 rounded-xl transition group ${
              task.completed ? "bg-pink-50" : "hover:bg-pink-50"
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                task.completed
                  ? "bg-pink-500 border-pink-500"
                  : "border-pink-300 hover:border-pink-400"
              }`}
            >
              {task.completed && <Check size={10} className="text-white" />}
            </button>
            <span
              className={`text-sm flex-1 truncate ${
                task.completed ? "line-through text-pink-400" : "text-gray-700"
              }`}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 transition text-pink-300 hover:text-pink-500"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
