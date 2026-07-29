import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, UserPlus, MessageCircle, MapPin, Sparkles, Check, Filter } from "lucide-react";
import { motion } from "motion/react";

export const FindPeople: React.FC = () => {
  const {
    nearbyUsers,
    globalUsers,
    selectedMapTab,
    setSelectedMapTab,
    sendFriendRequest,
    startChatWithUser,
    t,
    language,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  const activeUsersList = selectedMapTab === "nearby" ? nearbyUsers : globalUsers;

  const filteredUsers = activeUsersList.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.realName.toLowerCase().includes(query) ||
      u.country.toLowerCase().includes(query) ||
      (u.district && u.district.toLowerCase().includes(query)) ||
      (u as any).city?.toLowerCase().includes(query) ||
      u.interests.some((interest) => interest.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-20">
      
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>👥</span>
              <span>{t("people")}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {t("noPhoneTrace")}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setSelectedMapTab("nearby")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                selectedMapTab === "nearby"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              📍 {t("nearby")} ({nearbyUsers.length})
            </button>
            <button
              onClick={() => setSelectedMapTab("global")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                selectedMapTab === "global"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
            >
              🌍 {t("global")} ({globalUsers.length})
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mt-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === "bn"
                ? "নাম, জেলা, দেশ বা আগ্রহ দিয়ে খুঁজুন..."
                : "Search by real name, district, country, interest..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-blue-600 focus:bg-white transition"
          />
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => {
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.realName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-xs"
                    />
                    {user.isOnline && (
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                        title="Active Status 🟢"
                      ></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900 truncate">
                        {user.realName}
                      </h3>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {user.lastActive}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        {user.district || (user as any).city}, {user.country}
                      </span>
                      {user.distanceKm && (
                        <span className="text-slate-400">({user.distanceKm} km)</span>
                      )}
                    </p>

                    <p className="text-xs text-slate-700 mt-2 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                      "{user.bio}"
                    </p>
                  </div>
                </div>

                {/* Interests Chips */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {user.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-lg"
                    >
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  disabled={user.requestPending}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  {user.requestPending ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{t("requestSent")}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{t("friendRequest")}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => startChatWithUser(user)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t("sendMessage")}</span>
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
