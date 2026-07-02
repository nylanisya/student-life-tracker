import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  PenTool,
  Target,
  DollarSign,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Modal from "./Modal";
import QuickAidsList from "./QuickAidsList";
import axios from "axios";

const actions = [
  {
    icon: Heart,
    label: "New Gratitude",
    color: "text-pink-500",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    description: "Tulis hal yang disyukuri hari ini",
    apiUrl: "http://localhost:5000/api/gratitudes",
    table: "gratitudes",
    fields: [
      {
        name: "content",
        label: "Apa yang kamu syukuri?",
        type: "textarea",
        placeholder: "Tulis hal yang membuatmu bersyukur...",
      },
    ],
    defaultData: {},
  },
  {
    icon: MessageSquare,
    label: "New Reflection",
    color: "text-pink-400",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    description: "Refleksi diri hari ini",
    apiUrl: "http://localhost:5000/api/reflections",
    table: "reflections",
    fields: [
      {
        name: "content",
        label: "Refleksi hari ini",
        type: "textarea",
        placeholder: "Tulis refleksi dirimu...",
      },
    ],
    defaultData: {},
  },
  {
    icon: PenTool,
    label: "New Journal",
    color: "text-pink-600",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    description: "Tulis jurnal harian",
    apiUrl: "http://localhost:5000/api/journals",
    table: "journals",
    fields: [
      {
        name: "title",
        label: "Judul",
        type: "text",
        placeholder: "Judul jurnal...",
      },
      {
        name: "content",
        label: "Isi Jurnal",
        type: "textarea",
        placeholder: "Tulis jurnalmu...",
      },
    ],
    defaultData: {},
  },
  {
    icon: Target,
    label: "New Goals",
    color: "text-pink-500",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    description: "Buat target baru",
    apiUrl: "http://localhost:5000/api/goals",
    table: "goals",
    fields: [
      {
        name: "title",
        label: "Target",
        type: "text",
        placeholder: "Apa targetmu?",
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "textarea",
        placeholder: "Deskripsikan targetmu...",
      },
      {
        name: "target_date",
        label: "Target Selesai",
        type: "date",
        placeholder: "",
      },
    ],
    defaultData: { status: "pending" },
  },
  {
    icon: DollarSign,
    label: "New Expense",
    color: "text-pink-400",
    bgColor: "bg-pink-50 hover:bg-pink-100",
    description: "Catat pengeluaran",
    apiUrl: "http://localhost:5000/api/expenses",
    table: "expenses",
    fields: [
      {
        name: "item",
        label: "Item",
        type: "text",
        placeholder: "Nama item...",
      },
      {
        name: "amount",
        label: "Jumlah",
        type: "number",
        placeholder: "100000",
      },
      {
        name: "category",
        label: "Kategori",
        type: "select",
        options: [
          "makanan",
          "transport",
          "belanja",
          "tagihan",
          "hiburan",
          "lainnya",
        ],
      },
    ],
    defaultData: { date: new Date().toISOString().split("T")[0] },
  },
];

const QuickActions: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<
    (typeof actions)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showList, setShowList] = useState(false);
  const [listType, setListType] = useState<string>("gratitudes");
  const [listLabel, setListLabel] = useState<string>("Gratitude");

  const handleActionClick = (action: (typeof actions)[0]) => {
    setSelectedAction(action);
    const defaultData = action.defaultData || {};
    setFormData(defaultData);
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedAction) return;

    setIsSubmitting(true);
    try {
      const requiredFields = selectedAction.fields.filter(
        (f) =>
          f.name !== "description" &&
          f.name !== "target_date" &&
          f.name !== "category"
      );
      for (const field of requiredFields) {
        if (!formData[field.name] || formData[field.name] === "") {
          alert(`Field "${field.label}" wajib diisi!`);
          setIsSubmitting(false);
          return;
        }
      }

      const dataToSend = {
        ...selectedAction.defaultData,
        ...formData,
      };

      console.log("📤 Sending to:", selectedAction.apiUrl);
      console.log("📦 Data:", dataToSend);

      const response = await axios.post(selectedAction.apiUrl, dataToSend);
      console.log("✅ Data saved:", response.data);

      setSuccessMessage("✅ Berhasil disimpan!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedAction(null);
        setFormData({});
        setSuccessMessage("");
      }, 1500);
    } catch (err: any) {
      console.error("❌ Error saving:", err);
      console.error("❌ Response:", err.response?.data);
      alert(
        `Gagal menyimpan data: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== VIEW ALL - TANPA ARGUMEN =====
  const handleViewAll = () => {
    setListType("gratitudes");
    setListLabel("All Quick Aids");
    setShowList(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles size={16} className="text-pink-500" />
            Quick Aids
          </h3>
          <button
            onClick={handleViewAll}
            className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1 transition"
          >
            View all
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={`
                flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl 
                ${action.bgColor} transition group
                hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              <div
                className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-xl 
                bg-white/70 flex items-center justify-center 
                group-hover:bg-white transition
              `}
              >
                <action.icon
                  size={20}
                  className={`${action.color} sm:size-[22px]`}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">
                {action.label}
              </span>
              <span className="text-[8px] sm:text-[10px] text-gray-400 text-center hidden sm:block">
                {action.description}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200">
          <p className="text-[11px] sm:text-xs text-pink-700 text-center leading-relaxed">
            ✨ Your dreams are not random — they are whispers from your future
            self.
          </p>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAction(null);
          setFormData({});
          setSuccessMessage("");
        }}
        onConfirm={handleSubmit}
        title={selectedAction?.label || "Buat Baru"}
        message={selectedAction?.description || ""}
        type="info"
        confirmText={
          successMessage ? "Selesai" : isSubmitting ? "Menyimpan..." : "Simpan"
        }
        cancelText="Batal"
        confirmDisabled={isSubmitting || !!successMessage}
      >
        {successMessage ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-600 font-medium">{successMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedAction?.fields.map((field, idx) => (
              <div key={idx}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {field.label}{" "}
                  {field.name !== "description" &&
                    field.name !== "target_date" &&
                    field.name !== "category" && (
                      <span className="text-red-500">*</span>
                    )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[80px]"
                    required={field.name !== "description"}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                  >
                    <option value="">Pilih kategori...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Popup List Data */}
      {showList && (
        <QuickAidsList
          type={listType}
          label={listLabel}
          onClose={() => setShowList(false)}
        />
      )}
    </>
  );
};

export default QuickActions;
