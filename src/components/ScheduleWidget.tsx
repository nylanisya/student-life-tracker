import React from "react";
import { useStudentData } from "../hooks/useStudentData";
import { Calendar, AlertCircle } from "lucide-react";
import { type ScheduleItem } from "../types";

const ScheduleWidget: React.FC = () => {
  const { getUpcomingSchedule } = useStudentData();
  const schedule = getUpcomingSchedule();

  // Fungsi untuk mengubah tipe jadwal ke bahasa Indonesia
  const getTypeLabel = (type: ScheduleItem["type"]) => {
    const map = {
      tuton: "Tutorial Online",
      tugas1: "Tugas 1",
      tugas2: "Tugas 2",
      tugas3: "Tugas 3",
      uo: "Ujian Online",
    };
    return map[type] || type;
  };

  // Fungsi menghitung hari tersisa
  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const due = new Date(dateStr);
    const diff = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div className="bg-white rounded-lg border border-[#FFB6C1] p-6 shadow-sm">
      <h3 className="text-lg font-light text-gray-700 mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-[#FFB6C1]" />
        Jadwal Mendatang (UT)
      </h3>
      {schedule.length === 0 ? (
        <p className="text-sm text-gray-400">Tidak ada jadwal.</p>
      ) : (
        <ul className="space-y-4">
          {schedule.map((item) => {
            const days = getDaysUntil(item.dueDate);
            const isUrgent = days <= 3; // deadline 3 hari lagi
            return (
              <li
                key={item.id}
                className="flex items-start justify-between border-b border-[#FFF0F5] pb-3 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {item.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0F5] text-gray-600 border border-[#FFB6C1]">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Deadline:{" "}
                    {new Date(item.dueDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isUrgent && (
                    <AlertCircle size={16} className="text-[#FFB6C1]" />
                  )}
                  <span
                    className={`text-sm font-light ${
                      isUrgent ? "text-[#FFB6C1]" : "text-gray-400"
                    }`}
                  >
                    {days > 0
                      ? `${days} hari`
                      : days === 0
                      ? "Hari ini"
                      : "Terlewat"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ScheduleWidget;
