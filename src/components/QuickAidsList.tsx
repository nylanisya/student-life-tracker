import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  PenTool,
  Target,
  DollarSign,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import Modal from "./Modal";

interface QuickAidsListProps {
  type: string;
  label: string;
  onClose: () => void;
}

const typeOptions = [
  {
    value: "gratitudes",
    label: "Gratitude",
    icon: Heart,
    color: "text-pink-500",
  },
  {
    value: "reflections",
    label: "Reflection",
    icon: MessageSquare,
    color: "text-pink-400",
  },
  {
    value: "journals",
    label: "Journal",
    icon: PenTool,
    color: "text-pink-600",
  },
  { value: "goals", label: "Goals", icon: Target, color: "text-pink-500" },
  {
    value: "expenses",
    label: "Expense",
    icon: DollarSign,
    color: "text-pink-400",
  },
];

const API_URL = "https://naylanisya.rf.gd/api.php";

const QuickAidsList: React.FC<QuickAidsListProps> = ({
  type: initialType,
  label,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState(initialType);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const currentConfig = typeOptions.find((t) => t.value === selectedType);
  const Icon = currentConfig?.icon || Heart;

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(
        `📡 Fetching ${selectedType} from: ${API_URL}/${selectedType}`
      );
      const response = await axios.get(`${API_URL}/${selectedType}`);
      console.log(`📊 Response ${selectedType}:`, response.data);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(`Error fetching ${selectedType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  // ===== EDIT =====
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleUpdate = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { id: _, created_at, updated_at, ...updatePayload } = editData;

      console.log(`📤 Updating ${selectedType}/${id}:`, updatePayload);
      const response = await axios.put(
        `${API_URL}/${selectedType}/${id}`,
        updatePayload
      );
      console.log("✅ Update response:", response.data);

      if (response.data.success) {
        await fetchData();
        setEditingId(null);
        setEditData({});
      }
    } catch (err) {
      console.error("❌ Error updating:", err);
      alert("Gagal update data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // ===== DELETE =====
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsSubmitting(true);
    try {
      console.log(`📤 Deleting ${selectedType}/${deleteTargetId}`);
      const response = await axios.delete(
        `${API_URL}/${selectedType}/${deleteTargetId}`
      );
      console.log("✅ Delete response:", response.data);

      if (response.data.success) {
        await fetchData();
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
        setDeleteTargetName("");
      }
    } catch (err) {
      console.error("❌ Error deleting:", err);
      alert("Gagal hapus data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
          <Loader2 size={32} className="text-pink-500 animate-spin" />
          <span className="ml-3 text-gray-600">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-pink-100">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-pink-100 shrink-0">
            <div className="flex items-center gap-3">
              <Icon
                size={24}
                className={currentConfig?.color || "text-pink-500"}
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {currentConfig?.label || "Data"}
              </h2>
              <span className="text-sm text-gray-400">({data.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg hover:bg-pink-50 transition bg-white"
                >
                  <span className="text-gray-600">{currentConfig?.label}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-pink-200 rounded-lg shadow-lg z-10 py-1">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleTypeChange(opt.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-pink-50 transition ${
                          selectedType === opt.value
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-700"
                        }`}
                      >
                        <opt.icon size={16} className={opt.color} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-pink-50 rounded-full transition text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* List Data */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {data.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Belum ada data</p>
                <p className="text-sm text-gray-300 mt-1">
                  Klik tombol + untuk menambahkan
                </p>
              </div>
            ) : (
              data.map((item) => (
                <div
                  key={item.id}
                  className="border border-pink-100 rounded-xl p-4 hover:bg-pink-50/50 transition"
                >
                  {editingId === item.id ? (
                    <div className="space-y-2">
                      {Object.keys(editData).map((key) => {
                        if (
                          key === "id" ||
                          key === "created_at" ||
                          key === "updated_at"
                        )
                          return null;
                        return (
                          <div key={key}>
                            <label className="text-xs font-medium text-gray-500 capitalize">
                              {key}
                            </label>
                            {key === "content" || key === "description" ? (
                              <textarea
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                rows={3}
                              />
                            ) : key === "status" ? (
                              <select
                                value={editData[key] || "pending"}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            ) : key === "category" ? (
                              <select
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                              >
                                <option value="makanan">Makanan</option>
                                <option value="transport">Transport</option>
                                <option value="belanja">Belanja</option>
                                <option value="tagihan">Tagihan</option>
                                <option value="hiburan">Hiburan</option>
                                <option value="lainnya">Lainnya</option>
                              </select>
                            ) : key === "amount" ? (
                              <input
                                type="number"
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                              />
                            ) : key === "date" || key === "target_date" ? (
                              <input
                                type="date"
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                              />
                            ) : (
                              <input
                                type="text"
                                value={editData[key] || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    [key]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                              />
                            )}
                          </div>
                        );
                      })}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          disabled={isSubmitting}
                          className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                          {isSubmitting ? "Menyimpan..." : "Simpan"}
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {selectedType === "journals" && (
                          <h4 className="font-semibold text-gray-800">
                            {item.title}
                          </h4>
                        )}
                        {selectedType === "goals" && (
                          <h4 className="font-semibold text-gray-800">
                            {item.title}
                          </h4>
                        )}
                        {selectedType === "expenses" && (
                          <h4 className="font-semibold text-gray-800">
                            {item.item}
                          </h4>
                        )}
                        {selectedType === "gratitudes" && (
                          <p className="text-gray-700">{item.content}</p>
                        )}
                        {selectedType === "reflections" && (
                          <p className="text-gray-700">{item.content}</p>
                        )}
                        {selectedType === "journals" && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {item.content}
                          </p>
                        )}
                        {selectedType === "goals" && item.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                          {selectedType === "expenses" && (
                            <>
                              <span className="font-medium text-pink-500">
                                {formatCurrency(item.amount)}
                              </span>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-pink-50 rounded-full">
                                {item.category}
                              </span>
                            </>
                          )}
                          {selectedType === "goals" && item.target_date && (
                            <span>Target: {formatDate(item.target_date)}</span>
                          )}
                          {selectedType === "goals" && (
                            <span
                              className={`px-2 py-0.5 rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status || "pending"}
                            </span>
                          )}
                          <span>•</span>
                          <span>
                            {formatDate(item.date || item.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 ml-4 shrink-0">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-pink-500 rounded-lg hover:bg-pink-50 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              item.id,
                              item.title || item.content || item.item || "data"
                            )
                          }
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-pink-100 shrink-0 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Total: {data.length} data
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Data?"
        message={`Yakin ingin menghapus "${deleteTargetName}"?`}
        type="danger"
        confirmText={isSubmitting ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        confirmDisabled={isSubmitting}
      />
    </>
  );
};

export default QuickAidsList;
