import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Trophy, Calendar, Clock, MapPin, Users, PlusCircle, Check } from "lucide-react";
import { motion } from "motion/react";

export const SportsSection: React.FC = () => {
  const { sportsGames, joinSportsGame, t, language } = useApp();
  const [selectedSport, setSelectedSport] = useState<string>("সব");

  const sportsFilterList = ["সব", "ক্রিকেট", "ফুটবল", "ব্যাডমিন্টন", "ভলিবল"];

  const filteredGames = sportsGames.filter(
    (g) => selectedSport === "সব" || g.sport === selectedSport
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white rounded-3xl p-6 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <h2 className="text-xl font-black">
            {language === "bn" ? "স্পোর্টস ও খেলাধুলা (Sports Corner)" : "Sports & Local Matches"}
          </h2>
        </div>
        <p className="text-xs text-indigo-200 mt-1">
          {language === "bn"
            ? "আশেপাশে কোথায় ক্রিকেট বা ফুটবল খেলা হচ্ছে জানুন এবং খেলায় যোগ দিন!"
            : "Discover nearby cricket, football and badminton games and join the squad!"}
        </p>

        {/* Sport Filter Buttons */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {sportsFilterList.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                selectedSport === sport
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game) => {
          const isFull = game.joinedCount >= game.totalNeeded;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {game.sport === "ক্রিকেট" ? "🏏" : "⚽"}
                    </span>
                    <div>
                      <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {game.sport}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                        {game.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-700 font-medium">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>📍 {game.venue}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>⏰ {game.date} • {game.time}</span>
                  </p>
                </div>

                {/* Organizer */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={game.organizerAvatar}
                      alt={game.organizerName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      आयোজক: {game.organizerName}
                    </span>
                  </div>

                  <span className="text-xs font-black text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-xl">
                    👥 {game.joinedCount}/{game.totalNeeded}
                  </span>
                </div>
              </div>

              <button
                onClick={() => joinSportsGame(game.id)}
                disabled={isFull}
                className={`mt-4 w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition ${
                  isFull
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isFull ? (
                  <span>{language === "bn" ? "টিম ফুল ⚽" : "Team Full"}</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>{t("joinMatch")}</span>
                  </>
                )}
              </button>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
