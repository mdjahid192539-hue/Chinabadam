import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Volume2, VolumeX, Sparkles, CheckCircle2, Coins, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const TriangleHomeAd: React.FC = () => {
  const { watchAdAndEarn } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (isDismissed) return null;
  const [watching, setWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  const adData = {
    brand: "বিকাশ ক্যাশব্যাক",
    title: "বিকাশে ক্যাশইন ও সেন্ড মানি বোনাস",
    rewardAmount: 3.50,
    tagline: "আজই বিকাশ অ্যাপ ডাউনলোড করে নিন ১০০০ টাকার কুপন!",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
  };

  const startAdWatch = () => {
    setWatching(true);
    setTimeLeft(5);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWatching(false);
          setClaimed(true);
          watchAdAndEarn(adData.rewardAmount, adData.title);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="relative my-2">
      {/* Compact Triangular Corner / Badge Ad Widget (1 Inch size on mobile) */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-2xl p-0.5 shadow-md overflow-hidden relative">
        <div className="bg-slate-900 rounded-[14px] p-2.5 flex items-center justify-between gap-2 relative overflow-hidden">
          
          {/* Decorative Triangle Notch on Corner */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-t-amber-400 border-l-[28px] border-l-transparent pointer-events-none drop-shadow-sm">
            <span className="absolute -top-[25px] -right-[2px] text-[8px] font-black text-slate-950 rotate-45 uppercase">
              AD
            </span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            {/* Small Triangle Icon Badge */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm relative">
              {/* Polygon Triangle Graphic */}
              <svg className="w-5 h-5 text-slate-950 fill-current" viewBox="0 0 24 24">
                <polygon points="12,2 22,20 2,20" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase">
                  স্পন্সরড
                </span>
                <span className="text-[10px] text-amber-200 font-bold truncate">
                  +৳{adData.rewardAmount.toFixed(2)} আয়
                </span>
              </div>
              <p className="text-xs font-black text-white truncate mt-0.5">
                {adData.brand} — {adData.title}
              </p>
            </div>
          </div>

          {/* Trigger & Close Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition flex items-center gap-1"
            >
              <span>{claimed ? "অর্জিত ✅" : "এড দেখুন ➡️"}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ad Detail Modal when clicked */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-xs w-full p-4 space-y-3 shadow-2xl relative text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="12,2 22,20 2,20" />
                    </svg>
                  </div>
                  <span>{adData.brand}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={adData.image}
                  alt={adData.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <p className="text-xs font-black text-amber-200">"{adData.tagline}"</p>
                </div>
              </div>

              {claimed ? (
                <div className="bg-emerald-950 border border-emerald-500/40 p-2.5 rounded-xl text-center text-xs font-black text-emerald-300">
                  🎉 +৳{adData.rewardAmount.toFixed(2)} সফলভাবে জমা হয়েছে!
                </div>
              ) : watching ? (
                <div className="bg-amber-950 border border-amber-500/40 p-2.5 rounded-xl text-center text-xs font-black text-amber-300">
                  ⏳ অপেক্ষা করুন: {timeLeft} সেকেন্ড...
                </div>
              ) : (
                <button
                  onClick={startAdWatch}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black py-2 rounded-xl text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>ভিডিও দেখুন (+৳{adData.rewardAmount.toFixed(2)})</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
