import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Save, Award, Loader2 } from "lucide-react";
import { useIpk } from "../hooks/useIpk";
import Modal from "./Modal";

const IpkManager: React.FC = () => {
  const {
    ipkHistory,
    addIpk,
    updateIpk,
    deleteIpk,
    loading,
    error,
    refreshIpk,
  } = useIpk();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSemester, setFormSemester] = useState<number>(1);
  const [formValue, setFormValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk modal
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!formValue) return;
    setIsSubmitting(true);
    const success = await addIpk(formSemester, parseFloat(formValue));
    setIsSubmitting(false);
    if (success) {
      setFormSemester(ipkHistory.length + 1);
      setFormValue("");
      setIsAdding(false);
    }
  };

  const handleEdit = (id: string) => {
    const record = ipkHistory.find((r) => r.id === id);
    if (record) {
      setFormSemester(record.semester);
      setFormValue(record.value.toString());
      setEditingId(id);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formValue) return;
    setIsSubmitting(true);
    const success = await updateIpk(
      editingId,
      formSemester,
      parseFloat(formValue)
    );
    setIsSubmitting(false);
    if (success) {
      setEditingId(null);
      setFormSemester(ipkHistory.length + 1);
      setFormValue("");
    }
  };

  const handleDeleteClick = (id: string, semester: number) => {
    setDeleteTargetId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      setIsSubmitting(true);
      await deleteIpk(deleteTargetId);
      setIsSubmitting(false);
      setDeleteTargetId(null);
      setModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormSemester(ipkHistory.length + 1);
    setFormValue("");
  };

  if (loading) {
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
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-pink-500" />
            <h3 className="text-sm font-semibold text-gray-700">Riwayat IPS</h3>
            <span className="text-xs text-gray-400">({ipkHistory.length})</span>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setFormSemester(ipkHistory.length + 1);
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
              <input
                type="number"
                placeholder="IPS"
                step="0.01"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
          {ipkHistory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">
              Belum ada data
            </p>
          ) : (
            ipkHistory
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
                        type="number"
                        step="0.01"
                        value={formValue}
                        onChange={(e) => setFormValue(e.target.value)}
                        className="flex-1 min-w-[80px] px-2 py-1 text-sm border border-pink-200 rounded-lg"
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
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Semester {record.semester}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(record.createdAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short" }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-pink-600">
                          {record.value.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-gray-400 hover:text-pink-500 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(record.id, record.semester)
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

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data IPS?"
        message="Yakin ingin menghapus data IPS ini? Data yang dihapus tidak dapat dikembalikan."
        type="danger"
        confirmText="Ya, Hapus"
        cancelText="Batal"
      />
    </>
  );
};

export default IpkManager;
