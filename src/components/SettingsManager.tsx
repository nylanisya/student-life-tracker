import React, { useState } from "react";
import { Settings, Save, Loader2, X } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

const SettingsManager: React.FC = () => {
  const { settings, loading, error, updateTotalSks, refreshSettings } =
    useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [newTotalSks, setNewTotalSks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setNewTotalSks(settings.totalSksTarget.toString());
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!newTotalSks) return;
    setIsSubmitting(true);
    const success = await updateTotalSks(parseInt(newTotalSks));
    setIsSubmitting(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewTotalSks("");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm flex items-center justify-center h-20">
        <Loader2 size={20} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
        <p className="text-sm text-red-500 text-center">{error}</p>
        <button
          onClick={refreshSettings}
          className="mt-2 text-sm text-pink-500 hover:text-pink-600 text-center w-full"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-pink-500" />
          <h3 className="text-sm font-semibold text-gray-700">Pengaturan</h3>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-xs text-pink-500 hover:text-pink-600 font-medium"
          >
            Ubah
          </button>
        )}
      </div>

      <div className="mt-3">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Total SKS Target</label>
              <input
                type="number"
                value={newTotalSks}
                onChange={(e) => setNewTotalSks(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="144"
              />
            </div>
            <div className="flex gap-1 mt-5">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl border border-pink-100">
            <div>
              <p className="text-xs text-gray-500">Total SKS Target</p>
              <p className="text-lg font-bold text-pink-600">
                {settings.totalSksTarget} SKS
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Program Studi</p>
              <p className="text-sm font-medium text-gray-700">S1</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsManager;
