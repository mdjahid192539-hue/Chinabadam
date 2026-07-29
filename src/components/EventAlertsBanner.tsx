import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { AlertTriangle, Droplet, Activity, HeartHandshake, X, ChevronRight, BellRing, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EventAlert } from "../types";

export const EventAlertsBanner: React.FC = () => {
  const { eventAlerts, dismissEventAlert, setActiveTab, t, language, startChatWithUser, nearbyUsers } = useApp();
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<EventAlert["type"]>("blood");

  if (eventAlerts.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 my-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === "bn" ? "রিয়েল-টাইম ইভেন্ট অ্যালার্ট সিস্টেম" : "Real-time Event Alerts"}
            </h4>
            <p className="text-xs text-slate-600">
              {language === "bn" ? "বর্তমানে কোনো জরুরি অ্যালার্ট নেই। আপনি নতুন অ্যালার্ট তৈরি করতে পারেন।" : "No urgent alerts right now. You can post a new alert."}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddAlertModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === "bn" ? "অ্যালার্ট দিন" : "Post Alert"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="my-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span>{t("realtimeAlerts")}</span>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
              {eventAlerts.length} {language === "bn" ? "টি সক্রিয়" : "Active"}
            </span>
          </h3>
        </div>

        <button
          onClick={() => setShowAddAlertModal(true)}
          className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{language === "bn" ? "+ ইভেন্ট অ্যালার্ট তৈরি করুন" : "+ Create Alert"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {eventAlerts.map((alert) => {
            const isBlood = alert.type === "blood";
            const isSports = alert.type === "sports";
            const isPrayer = alert.type === "prayer";

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative p-3.5 rounded-2xl border shadow-xs transition-all ${
                  isBlood
                    ? "bg-red-50/90 border-red-200 text-red-950"
                    : isSports
                    ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
                    : "bg-blue-50/90 border-blue-200 text-blue-950"
                }`}
              >
                <button
                  onClick={() => dismissEventAlert(alert.id)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg shadow-xs ${
                      isBlood
                        ? "bg-red-600 text-white"
                        : isSports
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {isBlood ? "🩸" : isSports ? "⚽" : "🕌"}
                  </div>

                  <div className="pr-6 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm leading-tight text-slate-900">
                        {language === "en" && alert.titleEn ? alert.titleEn : alert.title}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                        📍 {alert.locationName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">
                        ⏰ {alert.timestamp}
                      </span>

                      <button
                        onClick={() => {
                          if (isBlood) {
                            startChatWithUser(nearbyUsers[4] || nearbyUsers[0]);
                          } else if (isSports) {
                            setActiveTab("sports");
                          } else if (isPrayer) {
                            setActiveTab("islamic");
                          }
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs ${
                          isBlood
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : isSports
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <span>
                          {alert.actionText ||
                            (language === "bn" ? "বিস্তারিত দেখুন" : "View Details")}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Alert Modal */}
      {showAddAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>🚨</span>
                <span>{language === "bn" ? "নতুন রিয়েল-টাইম অ্যালার্ট যোগ করুন" : "Add Real-time Event Alert"}</span>
              </h3>
              <button
                onClick={() => setShowAddAlertModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "অ্যালার্টের ধরন" : "Alert Type"}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-blue-600"
                >
                  <option value="blood">🩸 {language === "bn" ? "জরুরি রক্ত প্রয়োজন" : "Urgent Blood Request"}</option>
                  <option value="sports">⚽ {language === "bn" ? "খেলাধুলার প্লেয়ার প্রয়োজন" : "Sports Match Players"}</option>
                  <option value="mahfil">📢 {language === "bn" ? "কমিউনিটি ইভেন্ট / মাহফিল" : "Community Event"}</option>
                  <option value="general">🔔 {language === "bn" ? "সাধারণ নোটিশ" : "General Notice"}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "শিরোনাম" : "Title"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === "bn" ? "যেমন: ধানমণ্ডিতে B+ve রক্ত জরুরি" : "e.g., B+ve blood needed urgently"}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "বিস্তারিত বিবরণ" : "Detailed Description"}
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder={language === "bn" ? "স্থান, সময় ও যোগাযোগের বিবরণ দিন..." : "Enter location, time and details..."}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowAddAlertModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  if (!newTitle.trim()) return;
                  setShowAddAlertModal(false);
                  setNewTitle("");
                  setNewDesc("");
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs"
              >
                {language === "bn" ? "পাবলিশ করুন" : "Publish Alert"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
