import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, BookOpen, Loader2 } from "lucide-react";
import { useSks } from "../hooks/useSks";
import Modal from "./Modal";
import axios from "axios";

const API_URL = "https://naylanisya.rf.gd/api.php";

const SksManager: React.FC = () => {
  const {
    sksHistory,
    summary,
    addSks,
    updateSks,
    deleteSks,
    loading,
    error,
    refreshSks,
  } = useSks();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSemester, setFormSemester] = useState<number>(1);
  const [formMataKuliah, setFormMataKuliah] = useState<string>("");
  const [formSks, setFormSks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseNames, setCourseNames] = useState<string[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  // Fetch mata kuliah untuk dropdown
  const fetchCourses = async () => {
    try {
      setCourseLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success && Array.isArray(response.data.data)) {
        const names = response.data.data.map((c: any) => c.name);
        setCourseNames(names);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = async () => {
    if (!formMataKuliah || !formSks) return;
    setIsSubmitting(true);
    const success = await addSks(
      formSemester,
      formMataKuliah,
      parseInt(formSks)
    );
    setIsSubmitting(false);
    if (success) {
      setFormSemester(1);
      setFormMataKuliah("");
      setFormSks("");
      setIsAdding(false);
    }
  };

  const handleEdit = (id: string) => {
    const record = sksHistory.find((r) => r.id === id);
    if (record) {
      setFormSemester(record.semester);
      setFormMataKuliah(record.mataKuliah);
      setFormSks(record.sks.toString());
      setEditingId(id);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formMataKuliah || !formSks) return;
    setIsSubmitting(true);
    const success = await updateSks(
      editingId,
      formSemester,
      formMataKuliah,
      parseInt(formSks)
    );
    setIsSubmitting(false);
    if (success) {
      setEditingId(null);
      setFormSemester(1);
      setFormMataKuliah("");
      setFormSks("");
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      setIsSubmitting(true);
      await deleteSks(deleteTargetId);
      setIsSubmitting(false);
      setDeleteTargetId(null);
      setDeleteTargetName("");
      setModalOpen(false); // ← TAMBAHKAN INI
    }
  };
  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormSemester(1);
    setFormMataKuliah("");
    setFormSks("");
  };

  if (loading || courseLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <Loader2 size={24} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <p className="text-sm text-red-500 text-center">{error}</p>
        <button
          onClick={refreshSks}
          className="mt-2 text-sm text-pink-500 hover:text-pink-600 text-center w-full"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-pink-500" />
            <h3 className="text-sm font-semibold text-gray-700">Riwayat SKS</h3>
            <span className="text-xs text-gray-400">({sksHistory.length})</span>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setFormSemester(summary.semesterTerakhir + 1);
            }}
            className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
          >
            <Plus size={14} />
            Tambah
          </button>
        </div>

        {isAdding && (
          <div className="mb-2 p-2 bg-pink-50 rounded-xl shrink-0">
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                placeholder="Semester"
                value={formSemester}
                onChange={(e) => setFormSemester(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <select
                value={formMataKuliah}
                onChange={(e) => setFormMataKuliah(e.target.value)}
                className="flex-1 min-w-[150px] px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="">Pilih Mata Kuliah</option>
                {courseNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="SKS"
                value={formSks}
                onChange={(e) => setFormSks(e.target.value)}
                className="w-20 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={handleAdd}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "..." : "Simpan"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {sksHistory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              Belum ada data
            </p>
          ) : (
            sksHistory
              .sort((a, b) => a.semester - b.semester)
              .slice(0, 3)
              .map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2.5 border border-pink-100 rounded-xl bg-pink-50/30 hover:bg-pink-50 transition"
                >
                  {editingId === record.id ? (
                    <div className="flex-1 flex flex-wrap gap-1">
                      <input
                        type="number"
                        value={formSemester}
                        onChange={(e) =>
                          setFormSemester(parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-2 py-1 text-sm border border-pink-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={formMataKuliah}
                        onChange={(e) => setFormMataKuliah(e.target.value)}
                        className="flex-1 min-w-[80px] px-2 py-1 text-sm border border-pink-200 rounded-lg"
                      />
                      <input
                        type="number"
                        value={formSks}
                        onChange={(e) => setFormSks(e.target.value)}
                        className="w-16 px-2 py-1 text-sm border border-pink-200 rounded-lg"
                      />
                      <button
                        onClick={handleUpdate}
                        className="px-2 py-1 bg-pink-500 text-white text-sm rounded-lg"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-2 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {record.mataKuliah}
                        </p>
                        <p className="text-xs text-gray-400">
                          Sem {record.semester} • {record.sks} SKS
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-gray-400 hover:text-pink-500 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(record.id, record.mataKuliah)
                          }
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data SKS?"
        message={`Yakin ingin menghapus data SKS untuk mata kuliah "${deleteTargetName}"?`}
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default SksManager;
