import React, { ReactNode, useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  CheckSquare,
  Calendar as CalendarIcon,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface LayoutProps {
  children: ReactNode;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [date, setDate] = useState<Value>(new Date());

  const scheduleDates = [
    "2026-07-02",
    "2026-07-05",
    "2026-07-07",
    "2026-07-10",
    "2026-07-12",
    "2026-07-25",
    "2026-07-26",
    "2026-08-09",
    "2026-08-20",
  ];

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (scheduleDates.includes(dateString)) {
        return (
          <div className="flex justify-center mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateString = date.toISOString().split("T")[0];
      if (scheduleDates.includes(dateString)) {
        return "bg-pink-50 rounded-full text-pink-700 font-medium hover:bg-pink-100";
      }
    }
    return "";
  };

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard" },
    { icon: CheckSquare, label: "Tasks" },
    { icon: CalendarIcon, label: "Schedule" },
    { icon: BookOpen, label: "Books" },
    { icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-[#FFF5F8]"}`}
    >
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-pink-100 z-40 flex-col overflow-y-auto">
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-200 flex-shrink-0">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                Life Planner
              </h1>
              <p className="text-[10px] text-pink-400">
                Dream it. Believe it. Do it.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mb-4">
            <ul className="space-y-1.5">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
                      ${
                        index === 0
                          ? "bg-pink-50 text-pink-600 font-medium"
                          : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                      }
                    `}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Calendar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">
                Schedule
              </span>
              <span className="text-[10px] text-pink-400">
                {scheduleDates.length} events
              </span>
            </div>
            <div className="p-2 bg-pink-50/50 rounded-xl border border-pink-100">
              <Calendar
                onChange={setDate}
                value={date}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="border-0 w-full text-sm"
                formatShortWeekday={(locale, date) => {
                  const days = [
                    "Min",
                    "Sen",
                    "Sel",
                    "Rab",
                    "Kam",
                    "Jum",
                    "Sab",
                  ];
                  return days[date.getDay()];
                }}
                formatMonthYear={(locale, date) => {
                  const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "Mei",
                    "Jun",
                    "Jul",
                    "Ags",
                    "Sep",
                    "Okt",
                    "Nov",
                    "Des",
                  ];
                  return `${months[date.getMonth()]} ${date.getFullYear()}`;
                }}
              />
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span>Ada jadwal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-pink-200"></div>
                <span>Hari ini</span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-auto pt-4 border-t border-pink-100">
            <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200">
              <p className="text-[11px] text-pink-700 leading-relaxed text-center">
                Your dreams are not random
              </p>
              <p className="text-[10px] text-pink-500 text-center">
                They are whispers from your future self
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Drawer */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-pink-100 z-50 lg:hidden flex flex-col overflow-y-auto">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-200 flex-shrink-0">
                    <Sparkles className="text-white" size={18} />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                      Life Planner
                    </h1>
                    <p className="text-[10px] text-pink-400">
                      Dream it. Believe it. Do it.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 hover:bg-pink-50 rounded-lg"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <nav className="mb-4">
                <ul className="space-y-1.5">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className={`
                          flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
                          ${
                            index === 0
                              ? "bg-pink-50 text-pink-600 font-medium"
                              : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                          }
                        `}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto pt-4 border-t border-pink-100">
                <div className="px-3 py-3 rounded-xl bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200">
                  <p className="text-[11px] text-pink-700 leading-relaxed text-center">
                    Your dreams are not random
                  </p>
                  <p className="text-[10px] text-pink-500 text-center">
                    They are whispers from your future self
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-pink-50 rounded-lg"
          >
            <Menu size={22} className="text-gray-600" />
          </button>
          <h1 className="text-base font-semibold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            Life Planner
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 hover:bg-pink-50 rounded-lg"
          >
            {isDark ? (
              <Sun size={18} className="text-pink-500" />
            ) : (
              <Moon size={18} className="text-pink-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="lg:hidden h-14" />
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
