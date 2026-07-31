import React from "react";
import { useApp } from "../context/AppContext";
import { EventAlertsBanner } from "./EventAlertsBanner";
import { TriangleHomeAd } from "./TriangleHomeAd";
import {
  MapPin,
  Users,
  MessageCircle,
  UserPlus,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
  Heart,
  Clock,
  Sparkles,
  Radio,
  LocateFixed,
  Navigation
} from "lucide-react";
import { motion } from "motion/react";

export const HomeView: React.FC = () => {
  const {
    nearbyUsers,
    circlePosts,
    setActiveTab,
    setSelectedMapTab,
    t,
    language,
    setIsLogoModalOpen,
    sendFriendRequest,
    startChatWithUser,
    likePost,
    currentUser,
  } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 font-black pointer-events-none">
          🥜
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥜</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {t("appName")}
              </h1>
              <p className="text-xs text-blue-100 font-medium italic">
                "{t("slogan")}"
              </p>
            </div>
          </div>

          <p className="text-xs text-blue-100 mt-3 max-w-xl leading-relaxed font-normal">
            {language === "bn"
              ? "আশেপাশের ও সারা বিশ্বের নতুন মানুষের সঙ্গে পরিচিত হোন। মসজিদ, নামাজের সময়সূচী, স্থানীয় ইভেন্ট অ্যালার্ট, খেলাধুলা ও চ্যাট—সবকিছু ফোন নম্বর প্রকাশ ছাড়াই সম্পূর্ণ নিরাপদে!"
              : "Connect with active people nearby and globally. Discover mosques, prayer schedules, sports games, and local community alerts safely without sharing phone numbers."}
          </p>

          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => {
                setSelectedMapTab("nearby");
                setActiveTab("map");
              }}
              className="bg-white text-blue-900 font-extrabold px-4 py-2.5 rounded-xl shadow-md hover:bg-slate-100 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>🗺️ {t("map")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab("people")}
              className="bg-blue-800/80 hover:bg-blue-900 text-white font-extrabold px-4 py-2.5 rounded-xl border border-blue-600 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>👥 {t("people")}</span>
            </button>

            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl border border-amber-300 transition active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{language === "bn" ? "🎨 লোগো ডিজাইন" : "🎨 Customize Logo"}</span>
            </button>

            <div className="ml-auto hidden sm:flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{t("phoneHidden")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Dedicated Event Alerts System */}
      <EventAlertsBanner />

      {/* GPS Journey & Satellite Prayer Times Quick Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-4.5 sm:p-5 shadow-md border border-emerald-500/40 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                {language === "bn" ? "আজকের যাত্রাপথ জিপিএস নামাজ ট্র্যাকার" : "GPS Journey Prayer Tracker"}
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base mt-0.5 text-white">
              {language === "bn"
                ? "যাত্রাপথে নামাজের চিন্তা? জিপিএস অন করে সঠিক সময় ও কাউন্টডাউন দেখুন!"
                : "Travelling today? Turn on GPS for live moving district prayer countdowns!"}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {language === "bn"
                ? "স্যাটেলাইট জিপিএস ডেটা দিয়ে আপনি যে জেলায় থাকবেন, সেই জেলার নামাজের প্রতিটি ওয়াক্তের বাকি সময় হিসাব করে দেবে।"
                : "Calculates live remaining prayer time in real-time as you travel across districts."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("islamic")}
          className="z-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs px-4 py-3 rounded-2xl shadow-md flex items-center gap-2 shrink-0 transition active:scale-95"
        >
          <LocateFixed className="w-4 h-4 text-slate-950" />
          <span>{language === "bn" ? "📡 জিপিএস নামাজ ট্র্যাকার অন করুন" : "Enable GPS Prayer Tracker"}</span>
        </button>
      </div>

      {/* Small Triangular Home Page Single Ad */}
      <TriangleHomeAd />

      {/* Quick Access Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <button
          onClick={() => {
            setSelectedMapTab("nearby");
            setActiveTab("map");
          }}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">🗺️</span>
          <span className="text-xs font-extrabold text-slate-800">{t("map")}</span>
        </button>

        <button
          onClick={() => setActiveTab("people")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">👥</span>
          <span className="text-xs font-extrabold text-slate-800">{t("people")}</span>
        </button>

        <button
          onClick={() => setActiveTab("circle")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">📢</span>
          <span className="text-xs font-extrabold text-slate-800">{t("circle")}</span>
        </button>

        <button
          onClick={() => setActiveTab("islamic")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">🕌</span>
          <span className="text-xs font-extrabold text-slate-800">{t("islamic")}</span>
        </button>

        <button
          onClick={() => setActiveTab("sports")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">⚽</span>
          <span className="text-xs font-extrabold text-slate-800">{t("sports")}</span>
        </button>

        <button
          onClick={() => setActiveTab("tourism")}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition text-center flex flex-col items-center justify-center gap-1.5 group"
        >
          <span className="text-2xl transform group-hover:scale-110 transition">🌍</span>
          <span className="text-xs font-extrabold text-slate-800">{t("tourism")}</span>
        </button>
      </div>

      {/* Nearby Active People Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{language === "bn" ? "আশেপাশের সক্রিয় মানুষ" : "Active People Nearby"}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {language === "bn" ? "আপনার অবস্থান থেকে কয়েক মিটার বা কিলোমিটারের মধ্যে" : "Within meters/kilometers of your location"}
            </p>
          </div>

          <button
            onClick={() => setActiveTab("people")}
            className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>{language === "bn" ? "সব দেখুন" : "View All"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 hover:bg-white hover:shadow-sm transition flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.realName}
                    className="w-12 h-12 rounded-2xl object-cover border border-blue-600 shadow-2xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm text-slate-900 truncate">
                    {user.realName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    📍 {user.district} ({user.distanceKm} km)
                  </p>
                  <p className="text-[11px] text-slate-600 italic line-clamp-1 mt-1">
                    "{user.bio}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-2">
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  disabled={user.requestPending}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white text-[11px] font-extrabold py-2 rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                >
                  {user.requestPending ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("requestSent")}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t("friendRequest")}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => startChatWithUser(user)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold p-2 rounded-xl flex items-center justify-center shadow-2xs"
                  title="Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Islamic & Local Circle Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Islamic Snippet */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕌</span>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t("islamic")}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("islamic")}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {language === "bn" ? "বিস্তারিত সূচী" : "Full Schedule"}
              </button>
            </div>

            <div className="mt-3 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">
                  {language === "bn" ? "পরবর্তী নামায" : "Next Prayer"}
                </span>
                <h4 className="font-black text-sm text-emerald-950 mt-0.5">
                  যোহরের নামায — ১:১৫ PM
                </h4>
              </div>

              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-xl shadow-2xs">
                ⏰ ২৫ মিনিট বাকি
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 font-medium">
              📍 নিকটস্থ মসজিদ: <span className="font-bold text-slate-900">ধানমণ্ডি বায়তুল আমান জামে মসজিদ</span> (৩২০ মিটার দূরে)
            </p>
          </div>

          <button
            onClick={() => setActiveTab("islamic")}
            className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-2xs transition"
          >
            {language === "bn" ? "কিবলা কম্পাস ও মসজিদ ফাইন্ডার খুলুন" : "Open Qibla Compass & Mosque Finder"}
          </button>
        </div>

        {/* Circle Feed Snippet */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t("districtCommunity")}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("circle")}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                {language === "bn" ? "সব পোস্ট" : "All Posts"}
              </button>
            </div>

            {circlePosts[0] && (
              <div className="mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>📍 {circlePosts[0].authorDistrict}</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                    #{circlePosts[0].category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                  {circlePosts[0].title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                  {circlePosts[0].content}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("circle")}
            className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl shadow-2xs transition"
          >
            {t("createPost")}
          </button>
        </div>

      </div>

    </div>
  );
};
