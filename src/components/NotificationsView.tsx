import React from "react";
import { useApp } from "../context/AppContext";
import { Bell, CheckCheck, Trash2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, setActiveTab, t, language } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-700" />
            <span>{t("notifications")}</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {language === "bn" ? "নতুন ফ্রেন্ড রিকোয়েস্ট, মেসেজ ও নামাজ অ্যালার্ট" : "Friend requests, messages and prayer alerts"}
          </p>
        </div>

        <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
          {notifications.length} {language === "bn" ? "টি" : "Total"}
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => markNotificationRead(notif.id)}
            className={`p-4 rounded-3xl border transition cursor-pointer flex items-start gap-3.5 ${
              notif.isRead
                ? "bg-white border-slate-200 shadow-2xs"
                : "bg-blue-50/80 border-blue-300 shadow-sm ring-1 ring-blue-400/30"
            }`}
          >
            {notif.userAvatar ? (
              <img
                src={notif.userAvatar}
                alt=""
                className="w-10 h-10 rounded-2xl object-cover shrink-0 border border-blue-500 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                🔔
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900">
                  {notif.title}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {notif.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-700 mt-0.5 font-medium leading-relaxed">
                {notif.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
