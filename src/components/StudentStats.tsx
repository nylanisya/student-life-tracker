import React from "react";
import { Award, BookOpen, Calendar, Clock, TrendingUp } from "lucide-react";
import { useIpk } from "../hooks/useIpk";
import { useSks } from "../hooks/useSks";
import { useUas } from "../hooks/useUas";
import { useTugas } from "../hooks/useTugas";

const StudentStats: React.FC = () => {
  const {
    currentIpk,
    delta,
    ipkHistory,
    averageIpk,
    totalSemester,
    loading: ipkLoading,
  } = useIpk();
  const { summary, loading: sksLoading } = useSks();
  const { upcomingUas, getDaysLeft, loading: uasLoading } = useUas();
  const {
    upcomingTugas,
    getDaysLeft: getTugasDaysLeft,
    loading: tugasLoading,
  } = useTugas();

  if (ipkLoading || sksLoading || uasLoading || tugasLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-200"></div>
              <div className="flex-1">
                <div className="h-3 bg-pink-200 rounded w-12 mb-1"></div>
                <div className="h-5 bg-pink-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const nearestUas = upcomingUas;
  const nearestTugas = upcomingTugas;

  const cards = [
    {
      icon: Award,
      label: "IPK",
      // Tampilkan rata-rata IPS (IPK)
      value: ipkHistory.length > 0 ? averageIpk.toFixed(2) : "0.00",
      sub:
        ipkHistory.length > 0
          ? `Rata-rata dari ${totalSemester} semester`
          : "Belum ada data",
      color: "text-pink-500",
      showDelta: ipkHistory.length > 1,
      deltaValue: delta,
    },
    {
      icon: BookOpen,
      label: "SKS Lulus",
      value: `${summary.totalSksLulus} / ${summary.totalSksTarget}`,
      sub: `Semester ${summary.semesterTerakhir}`,
      color: "text-pink-500",
    },
    {
      icon: Calendar,
      label: "UAS",
      value: nearestUas
        ? `${getDaysLeft(nearestUas.tanggal)} hari`
        : "Belum ada jadwal",
      sub: nearestUas
        ? `${nearestUas.mataKuliah || "UAS"} - ${new Date(
            nearestUas.tanggal
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
          })}`
        : "Tambahkan jadwal UAS",
      color: "text-pink-500",
    },
    {
      icon: Clock,
      label: "Tugas Terdekat",
      value: nearestTugas
        ? `${getTugasDaysLeft(nearestTugas.deadline)} hari`
        : "Belum ada tugas",
      sub: nearestTugas
        ? `${nearestTugas.mataKuliah || "Tugas"} - ${
            nearestTugas.tugas || "Tugas"
          }`
        : "Tambahkan tugas",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
              <card.icon size={20} className={card.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-pink-400">{card.label}</p>
              <p className="text-lg font-bold text-gray-800 truncate">
                {card.value}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">{card.sub}</p>

          {index === 0 && card.showDelta && (
            <div className="flex items-center gap-1 mt-0.5">
              <TrendingUp
                size={12}
                className={
                  card.deltaValue >= 0 ? "text-green-500" : "text-red-500"
                }
              />
              <span
                className={`text-xs font-medium ${
                  card.deltaValue >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.deltaValue >= 0 ? "↑" : "↓"}{" "}
                {Math.abs(card.deltaValue).toFixed(2)} dari sem lalu
              </span>
            </div>
          )}

          {index === 1 && (
            <div className="mt-1.5 h-1 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full"
                style={{
                  width: `${
                    (summary.totalSksLulus / summary.totalSksTarget) * 100
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentStats;
