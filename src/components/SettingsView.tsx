import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Globe,
  ShieldCheck,
  Moon,
  Sun,
  Lock,
  PhoneOff,
  UserX,
  Sparkles,
  LogOut,
  ChevronRight,
  Bot,
  Check
} from "lucide-react";
import { motion } from "motion/react";
import { AiAssistantModal } from "./AiAssistantModal";
import { LanguageSelectorModal } from "./LanguageSelectorModal";
import { SUPPORTED_LANGUAGES } from "../utils/translations";

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t, setIsLoginModalOpen, currentUser } = useApp();

  const [showAiModal, setShowAiModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([
    "স্প্যাম অ্যাকাউন্ট ১",
    "অপরিচিত ইউজার ৯৯"
  ]);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span>⚙️</span>
          <span>{t("settings")}</span>
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {language === "bn"
            ? "ভাষা, প্রাইভেসি ও সিকিউরিটি সেটিংস পরিবর্তন করুন"
            : "Manage language, privacy and account security"}
        </p>
      </div>

      {/* AI Assistant Launcher Banner */}
      <div
        onClick={() => setShowAiModal(true)}
        className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-md cursor-pointer hover:shadow-lg transition flex items-center justify-between group border border-blue-600"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-sm transform group-hover:scale-110 transition">
            🤖
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full text-amber-300">
              Gemini AI
            </span>
            <h3 className="font-extrabold text-base mt-0.5">
              {t("aiAssistant")}
            </h3>
            <p className="text-xs text-blue-100">
              {language === "bn"
                ? "স্থানীয় স্থান, নামাজের মাসআলা ও আড্ডার টিপস নিয়ে কথা বলুন"
                : "Ask about local places, Islamic guidance and community tips"}
            </p>
          </div>
        </div>

        <ChevronRight className="w-6 h-6 text-amber-300 transform group-hover:translate-x-1 transition" />
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Globe className="w-5 h-5 text-blue-700" />
            <h3 className="font-extrabold text-sm">{t("language")}</h3>
          </div>
          <button
            onClick={() => setShowLangModal(true)}
            className="text-xs font-black text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
          >
            {language === "bn" ? "সকল ভাষা দেখুন 🌍" : "View All Languages 🌍"}
          </button>
        </div>

        {/* Current Language Badge & Quick Top Languages Grid */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentLangObj.flag}</span>
            <div>
              <span className="font-extrabold text-sm text-slate-900 block">
                {currentLangObj.nativeName} ({currentLangObj.name})
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {language === "bn" ? "বর্তমান ভাষা সক্রিয়" : "Active Language"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowLangModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            {language === "bn" ? "পরিবর্তন করুন" : "Change"}
          </button>
        </div>

        {/* Popular World Languages Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {SUPPORTED_LANGUAGES.slice(0, 8).map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition ${
                language === l.code
                  ? "bg-blue-700 text-white border-blue-800 shadow-xs"
                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span className="truncate">{l.flag} {l.nativeName}</span>
              {language === l.code && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Center */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 border-b pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-sm">🔒 {language === "bn" ? "প্রাইভেসি কেন্দ্র (Privacy)" : "Privacy Center"}</h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <PhoneOff className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {t("phoneHidden")}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === "bn" ? "অন্য কোনো ব্যবহারকারী আপনার মোবাইল নম্বর দেখতে পারবে না।" : "Your mobile number is 100% confidential."}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              সুরক্ষিত 🔒
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-900 block">
                  {t("houseLocationHidden")}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === "bn" ? "ম্যাপে আনুমানিক এলাকা দেখানো হয়, নির্দিষ্ট বাড়ি নয়।" : "Only approximate neighborhood is shown on map."}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              সুরক্ষিত 🔒
            </span>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="pt-2">
          <h4 className="font-extrabold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
            <UserX className="w-4 h-4 text-red-600" />
            <span>{language === "bn" ? "ব্লক করা তালিকা (Block List)" : "Blocked Users"}</span>
          </h4>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
            {blockedUsers.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{user}</span>
                <button
                  onClick={() => setBlockedUsers(blockedUsers.filter((_, i) => i !== idx))}
                  className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2.5 py-1 rounded-xl hover:bg-red-200 transition"
                >
                  {language === "bn" ? "আনব্লক" : "Unblock"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Action */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs p-3.5 rounded-2xl border border-red-200 flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === "bn" ? "মোবাইল নম্বর দিয়ে পুনর্লগইন (Login via OTP)" : "Re-login via Mobile OTP"}</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && <AiAssistantModal onClose={() => setShowAiModal(false)} />}

      {/* World Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </div>
  );
};
