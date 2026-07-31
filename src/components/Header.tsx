import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bell, Globe, Search, UserCheck, ShieldCheck, Sparkles, MessageCircle, Moon, Sun, Palette } from "lucide-react";
import { motion } from "motion/react";
import { LanguageSelectorModal } from "./LanguageSelectorModal";
import { SUPPORTED_LANGUAGES } from "../utils/translations";
import { ChinabadamLogo } from "./ChinabadamLogo";

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    notifications,
    setActiveTab,
    activeTab,
    currentUser,
    setIsLoginModalOpen,
    setIsLogoModalOpen
  } = useApp();

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-blue-700 text-white shadow-md border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab("home")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <ChinabadamLogo size="md" showText={true} textColor="text-white" />
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white shadow-xs shrink-0 self-start mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {language === "bn" ? "লাইভ" : "Live"}
              </span>
            </div>

            {/* Quick Logo Customizer Trigger */}
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="p-1.5 rounded-xl bg-blue-800/80 hover:bg-blue-900 text-amber-300 border border-blue-600/70 transition active:scale-95 text-xs font-bold flex items-center gap-1 shadow-xs"
              title={language === "bn" ? "অ্যাপের লোগো ও ব্র্যান্ডিং কাস্টমাইজ করুন" : "Customize App Logo"}
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline text-[10px] text-blue-100 font-extrabold">
                {language === "bn" ? "লোগো ডিজাইন" : "Logo Design"}
              </span>
            </button>
          </div>

          {/* Center Navigation Shortcuts for Desktop */}
          <div className="hidden md:flex items-center gap-1 bg-blue-800/60 p-1 rounded-xl border border-blue-600/50">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "home" ? "bg-white text-blue-800 shadow-xs" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "map" ? "bg-white text-blue-800 shadow-xs" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              🗺️ {t("map")}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "chat" ? "bg-white text-blue-800 shadow-xs" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              💬 {t("chat")}
            </button>
            <button
              onClick={() => setActiveTab("circle")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "circle" ? "bg-white text-blue-800 shadow-xs" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              📢 {t("circle")}
            </button>
            <button
              onClick={() => setActiveTab("islamic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "islamic" ? "bg-white text-blue-800 shadow-xs" : "text-blue-100 hover:bg-blue-700"
              }`}
            >
              🕌 {t("islamic")}
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            
            {/* World Language Switcher Button */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 border border-blue-600/80 text-xs font-black px-2.5 py-1.5 rounded-xl transition active:scale-95 shadow-xs"
              title="Select Language / ভাষা সিলেক্ট করুন"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
            </button>

            {/* Notifications Icon */}
            <button
              onClick={() => setActiveTab("notifications")}
              className="relative p-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-blue-100 transition active:scale-95"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-blue-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Pill */}
            <div
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-blue-800/80 hover:bg-blue-900 border border-blue-600/70 cursor-pointer transition active:scale-95"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.realName}
                className="w-7 h-7 rounded-full object-cover border border-amber-300 shadow-xs"
              />
              <span className="hidden sm:inline font-semibold text-xs text-white max-w-[100px] truncate">
                {currentUser.realName.split(" ")[0]}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Online"></span>
            </div>

          </div>

        </div>
      </div>

      {/* World Language Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </header>
  );
};
