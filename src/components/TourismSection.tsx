import React from "react";
import { useApp } from "../context/AppContext";
import { Compass, MapPin, Star, Navigation } from "lucide-react";
import { motion } from "motion/react";

export const TourismSection: React.FC = () => {
  const { tourismSpots, t, language } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-800 to-orange-700 text-white rounded-3xl p-6 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <h2 className="text-xl font-black">
            {language === "bn" ? "দর্শনীয় স্থান ও ভ্রমণ (Tourism)" : "Tourism & Sightseeing"}
          </h2>
        </div>
        <p className="text-xs text-amber-100 mt-1">
          {language === "bn"
            ? "আশেপাশের ও সারা দেশের চমৎকার ভ্রমণ স্পট, ছবি, রেটিং ও দিকনির্দেশনা"
            : "Explore beautiful attractions, photos, ratings & directions"}
        </p>
      </div>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tourismSpots.map((spot) => (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={spot.photo}
                  alt={spot.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-xl flex items-center gap-1 border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{spot.rating}</span>
                </div>

                <span className="absolute bottom-3 left-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {spot.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-extrabold text-base text-slate-900">
                  {spot.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{spot.address}</span>
                </p>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed line-clamp-3">
                  {spot.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  alert(`${spot.name}-এ যাওয়ার দিকনির্দেশনা ম্যাপে প্রদর্শন করা হচ্ছে!`);
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t("getDirections")}</span>
              </button>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};
