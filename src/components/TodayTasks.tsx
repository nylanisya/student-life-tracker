import React, { useState } from "react";
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Loader2,
  Search,
} from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import Modal from "./Modal";

const TodayTasks: React.FC = () => {
  const {
    tasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    loading,
    error,
    refreshTasks,
  } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter((t) => !t.completed).length;

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    setIsSubmitting(true);
    const success = await addTask(newTaskTitle.trim());
    setIsSubmitting(false);
    if (success) {
      setNewTaskTitle("");
      setIsAddModalOpen(false);
    }
  };

  const handleToggle = async (id: string) => {
    setIsSubmitting(true);
    await toggleTask(id);
    setIsSubmitting(false);
  };

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;
    setIsSubmitting(true);
    await updateTask(id, editTitle.trim());
    setIsSubmitting(false);
    setEditingId(null);
    setEditTitle("");
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(title);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      setIsSubmitting(true);
      await deleteTask(deleteTargetId);
      setIsSubmitting(false);
      setDeleteTargetId(null);
      setDeleteTargetName("");
      setDeleteModalOpen(false); // ← TAMBAHKAN INI
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <Loader2 size={24} className="text-pink-500 animate-spin" />
        <span className="ml-2 text-sm text-gray-400">Memuat tugas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex flex-col items-center justify-center">
        <p className="text-sm text-red-500 text-center">{error}</p>
        <button
          onClick={refreshTasks}
          className="mt-2 text-sm text-pink-500 hover:text-pink-600"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Check size={18} className="text-pink-500" />
            Today's Tasks
          </h3>
          <span className="text-xs text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
            {pendingTasks}/{filteredTasks.length}
          </span>
        </div>

        <div className="flex gap-2 mb-3 shrink-0">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl hover:opacity-90 transition shrink-0 flex items-center justify-center min-w-[40px]"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
          {filteredTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {searchQuery ? "Tidak ada tugas yang cocok" : "Belum ada tugas"}
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-2.5 p-2 rounded-xl transition group ${
                  task.completed ? "bg-pink-50" : "hover:bg-pink-50"
                }`}
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  disabled={isSubmitting}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                    task.completed
                      ? "bg-pink-500 border-pink-500"
                      : "border-pink-300 hover:border-pink-400"
                  }`}
                >
                  {task.completed && <Check size={10} className="text-white" />}
                </button>

                {editingId === task.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      onClick={() => handleUpdate(task.id)}
                      disabled={isSubmitting}
                      className="text-pink-500 hover:text-pink-600 transition"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`text-sm flex-1 truncate ${
                        task.completed
                          ? "line-through text-pink-400"
                          : "text-gray-700"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => handleEdit(task.id, task.title)}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-pink-500"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task.id, task.title)}
                      className="opacity-0 group-hover:opacity-100 transition text-pink-300 hover:text-pink-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah Task */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddTask}
        title="Tambah Tugas Baru"
        message="Masukkan judul tugas yang ingin ditambahkan."
        type="info"
        confirmText="Tambah"
        cancelText="Batal"
      >
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Judul Tugas
          </label>
          <input
            type="text"
            placeholder="Contoh: Kerjakan Tugas 1"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            autoFocus
          />
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Tugas?"
        message={`Yakin ingin menghapus tugas "${deleteTargetName}"?`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default TodayTasks;
