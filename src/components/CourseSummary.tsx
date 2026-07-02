import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Search,
} from "lucide-react";
import axios from "axios";
import Modal from "./Modal";

interface Course {
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

const CourseSummary: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editSemester, setEditSemester] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newSemester, setNewSemester] = useState<number>(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = async () => {
    if (!newName.trim() || !newCode.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(API_URL, {
        name: newName.trim(),
        code: newCode.trim(),
        semester: newSemester,
        progress: 0,
        modules: 0,
        completedModules: 0,
      });
      await fetchCourses();
      setNewName("");
      setNewCode("");
      setNewSemester(1);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setEditName(course.name);
    setEditCode(course.code);
    setEditSemester(course.semester);
  };

  const handleUpdate = async () => {
    if (!editingId || !editName.trim() || !editCode.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.put(`${API_URL}/${editingId}`, {
        name: editName.trim(),
        code: editCode.trim(),
        semester: editSemester,
      });
      await fetchCourses();
      setEditingId(null);
      setEditName("");
      setEditCode("");
      setEditSemester(1);
    } catch (err) {
      console.error("Error updating course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      setIsSubmitting(true);
      try {
        await axios.delete(`${API_URL}/${deleteTargetId}`);
        await fetchCourses();
        setDeleteTargetId(null);
        setDeleteTargetName("");
        setDeleteModalOpen(false); // ← TAMBAHKAN INI
      } catch (err) {
        console.error("Error deleting course:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCode("");
    setEditSemester(1);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <Loader2 size={24} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen size={18} className="text-pink-500" />
            Mata Kuliah
          </h3>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
          >
            <Plus size={14} />
            Tambah MK
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4 shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
          />
        </div>

        {/* List Courses - dengan scroll */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {filteredCourses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              {searchQuery
                ? "Tidak ada mata kuliah yang cocok"
                : "Belum ada mata kuliah"}
            </p>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-xl border border-pink-100 hover:bg-pink-50/30 transition"
              >
                {editingId === course.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Nama MK"
                      />
                      <input
                        type="text"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Kode MK"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editSemester}
                        onChange={(e) =>
                          setEditSemester(parseInt(e.target.value) || 1)
                        }
                        className="w-24 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Semester"
                      />
                      <button
                        onClick={handleUpdate}
                        disabled={isSubmitting}
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {course.name}
                        </span>
                        <span className="text-[10px] text-pink-400 shrink-0">
                          {course.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Semester {course.semester}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-gray-400 hover:text-pink-500 transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(course.id, course.name)
                        }
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

      {/* Modal Tambah Mata Kuliah */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddCourse}
        title="Tambah Mata Kuliah"
        message="Masukkan data mata kuliah baru."
        type="info"
        confirmText="Tambah"
        cancelText="Batal"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              placeholder="Contoh: Pendidikan Agama"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kode MK
              </label>
              <input
                type="text"
                placeholder="Contoh: MKWU4101"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Semester
              </label>
              <input
                type="number"
                placeholder="1"
                value={newSemester}
                onChange={(e) => setNewSemester(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Mata Kuliah?"
        message={`Yakin ingin menghapus mata kuliah "${deleteTargetName}"?`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default CourseSummary;
