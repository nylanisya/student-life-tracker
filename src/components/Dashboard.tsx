import React from "react";
import QuickActions from "./QuickActions";
import VisionBoard from "./VisionBoard";
import TodayTasks from "./TodayTasks";
import WeatherWidget from "./WeatherWidget";
import CourseSummary from "./CourseSummary";
import StudentStats from "./StudentStats";
import Finance from "./Finance";
import IpkManager from "./IpkManager";
import SksManager from "./SksManager";
import UasManager from "./UasManager";
import TugasManager from "./TugasManager";
import SettingsManager from "./SettingsManager";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Welcome back! 👋
          </h1>
          <p className="text-xs sm:text-sm text-pink-400">
            Here's your life overview for today
          </p>
        </div>
        <div className="text-[10px] sm:text-xs text-pink-400 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-pink-100 w-full sm:w-auto text-center sm:text-left">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Student Stats - 2 kolom di mobile, 4 di desktop */}
      <StudentStats />

      {/* 4 Kolom: IPS, SKS, UAS, Tugas - 1 kolom di mobile, 2 di tablet, 4 di desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="h-[200px] sm:h-[220px]">
          <IpkManager />
        </div>
        <div className="h-[200px] sm:h-[220px]">
          <SksManager />
        </div>
        <div className="h-[200px] sm:h-[220px]">
          <UasManager />
        </div>
        <div className="h-[200px] sm:h-[220px]">
          <TugasManager />
        </div>
      </div>

      {/* Settings */}
      <SettingsManager />

      {/* Finance */}
      <Finance />

      {/* Baris 1: Quick Actions + Weather - 1 kolom di mobile, 2 di desktop */}
      {/* Baris 1: Quick Actions + Weather - SAMA TINGGI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="md:col-span-2">
          <QuickActions />
        </div>
        <div className="h-full">
          <WeatherWidget />
        </div>
      </div>

      {/* Baris 2: Vision Board + Today's Tasks + Mata Kuliah - 1 kolom di mobile, 3 di desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="h-[280px] md:h-[320px]">
          <VisionBoard />
        </div>
        <div className="h-[280px] md:h-[320px]">
          <TodayTasks />
        </div>
        <div className="h-[280px] md:h-[320px]">
          <CourseSummary />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-[10px] sm:text-xs text-pink-400">
          Every small step you take today is shaping the life you once imagined.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
