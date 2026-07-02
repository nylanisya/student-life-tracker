import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  feelsLike: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  const mockWeather: WeatherData = {
    temp: 27,
    description: "Berawan",
    icon: "04d",
    humidity: 72,
    windSpeed: 12,
    city: "Pekanbaru",
    country: "ID",
    feelsLike: 28,
  };

  useEffect(() => {
    setWeather(mockWeather);
    setLoading(false);
    setUseMock(true);
  }, []);

  const getWeatherIcon = (icon: string) => {
    if (icon.includes("01") || icon.includes("02"))
      return <Sun size={36} className="text-yellow-400" />;
    if (icon.includes("03") || icon.includes("04"))
      return <Cloud size={36} className="text-gray-400" />;
    if (icon.includes("09") || icon.includes("10"))
      return <CloudRain size={36} className="text-blue-400" />;
    return <Cloud size={36} className="text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <Loader2 size={24} className="text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex items-center justify-center">
        <p className="text-sm text-pink-400 text-center">Gagal load cuaca</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm h-full flex flex-col">
      {/* Header: Kota + Demo Badge + Waktu */}
      <div className="flex items-center justify-between mb-1 shrink-0">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-pink-400" />
          <span className="text-base font-medium text-gray-700">
            {weather.city}
          </span>
          {useMock && (
            <span className="text-[9px] px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full font-medium">
              Demo
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Main: Suhu + Icon + Deskripsi */}
      <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-1">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">{getWeatherIcon(weather.icon)}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-800">
              {weather.temp}°
            </span>
            <span className="text-sm text-gray-400">C</span>
          </div>
          <span className="text-base text-gray-500 capitalize ml-1">
            {weather.description}
          </span>
        </div>
      </div>

      {/* Detail: Wind + Humidity + Feels Like */}
      <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-pink-100 text-sm text-gray-500 shrink-0">
        <div className="flex items-center gap-1.5">
          <Wind size={16} className="text-pink-400" />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets size={16} className="text-pink-400" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Terasa</span>
          <span className="font-medium text-gray-700">
            {weather.feelsLike}°
          </span>
        </div>
      </div>

      {/* Tombol Refresh */}
      <button
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setWeather(mockWeather);
            setLoading(false);
          }, 500);
        }}
        className="mt-1 self-end text-xs text-pink-400 hover:text-pink-600 transition flex items-center gap-1 shrink-0"
      >
        <RefreshCw size={12} />
        Refresh
      </button>
    </div>
  );
};

export default WeatherWidget;
