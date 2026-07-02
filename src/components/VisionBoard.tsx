import React, { useState } from "react";
import {
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
  Loader2,
} from "lucide-react";
import { useVision } from "../hooks/useVision";
import Modal from "./Modal";

const VisionBoard: React.FC = () => {
  const {
    visionItems,
    addVision,
    updateVision,
    deleteVision,
    loading,
    error,
    refreshVisions,
  } = useVision();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTimeline, setEditTimeline] = useState<"short-term" | "long-term">(
    "short-term"
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTimeline, setNewTimeline] = useState<"short-term" | "long-term">(
    "short-term"
  );
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const defaultCategories = [
    "Career & Growth",
    "Finance & Wealth",
    "Lifestyle & Home",
    "Health & Wellness",
  ];
  const existingCategories = [
    ...new Set(visionItems.map((item) => item.category)),
  ];

  const filteredItems = visionItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVision = async () => {
    if (!newTitle.trim() || !newCategory.trim()) return;
    const success = await addVision({
      title: newTitle.trim(),
      category: newCategory.trim(),
      timeline: newTimeline,
    });
    if (success) {
      setNewTitle("");
      setNewCategory("");
      setNewTimeline("short-term");
      setIsNewCategory(false);
      setIsAddModalOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    const item = visionItems.find((v) => v.id === id);
    if (item) {
      setEditTitle(item.title);
      setEditCategory(item.category);
      setEditTimeline(item.timeline);
      setEditingId(id);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !editTitle.trim() || !editCategory.trim()) return;
    const success = await updateVision(editingId, {
      title: editTitle.trim(),
      category: editCategory.trim(),
      timeline: editTimeline,
    });
    if (success) {
      setEditingId(null);
      setEditTitle("");
      setEditCategory("");
      setEditTimeline("short-term");
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await deleteVision(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName("");
      setDeleteModalOpen(false); // ← TAMBAHKAN INI
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCategory("");
    setEditTimeline("short-term");
  };

  const openAddModal = () => {
    setNewTitle("");
    setNewCategory("");
    setNewTimeline("short-term");
    setIsNewCategory(false);
    setIsAddModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <Loader2 size={24} className="text-pink-500 animate-spin" />
        <span className="ml-2 text-sm text-gray-400">Memuat vision...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex flex-col items-center justify-center">
        <p className="text-sm text-red-500 text-center">{error}</p>
        <button
          onClick={refreshVisions}
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
            <Sparkles size={18} className="text-pink-500" />
            Vision Board
          </h3>
          <span className="text-xs text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full">
            {visionItems.length}
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
              placeholder="Search vision..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            />
          </div>
          <button
            onClick={openAddModal}
            className="px-3 py-1.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-xl hover:opacity-90 transition shrink-0 flex items-center justify-center min-w-[40px]"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0">
          {filteredItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {searchQuery ? "Tidak ada vision yang cocok" : "Belum ada vision"}
            </p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200"
              >
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="Vision title"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Category"
                      />
                      <select
                        value={editTimeline}
                        onChange={(e) =>
                          setEditTimeline(
                            e.target.value as "short-term" | "long-term"
                          )
                        }
                        className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                      >
                        <option value="short-term">Short</option>
                        <option value="long-term">Long</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="flex-1 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition"
                      >
                        <Save size={14} className="inline mr-1" /> Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 text-pink-600">
                          {item.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-700">
                          {item.timeline === "short-term" ? "Short" : "Long"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-gray-400 hover:text-pink-500 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id, item.title)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah Vision */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsNewCategory(false);
        }}
        onConfirm={handleAddVision}
        title="Tambah Vision Baru"
        message="Masukkan visi dan kategori untuk vision board."
        type="info"
        confirmText="Tambah"
        cancelText="Batal"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Vision Title
            </label>
            <input
              type="text"
              placeholder="Contoh: Having multiple income streams"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                {!isNewCategory ? (
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      if (e.target.value === "__new__") {
                        setIsNewCategory(true);
                        setNewCategory("");
                      } else {
                        setNewCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                  >
                    <option value="">Pilih kategori...</option>
                    {defaultCategories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                    {existingCategories
                      .filter((c) => !defaultCategories.includes(c))
                      .map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    <option value="__new__">+ Buat kategori baru</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Kategori baru..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    autoFocus
                  />
                )}
              </div>
              {isNewCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategory(false);
                    setNewCategory("");
                  }}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Timeline
            </label>
            <select
              value={newTimeline}
              onChange={(e) =>
                setNewTimeline(e.target.value as "short-term" | "long-term")
              }
              className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            >
              <option value="short-term">Short Term</option>
              <option value="long-term">Long Term</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Vision?"
        message={`Yakin ingin menghapus vision "${deleteTargetName}"?`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default VisionBoard;
