import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Coins,
  Tv,
  ArrowRight,
  ShieldCheck,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface InterstitialAd {
  id: string;
  brand: string;
  title: string;
  rewardAmount: number;
  durationSec: number;
  thumbnail: string;
  gradientBg: string;
  tagline: string;
  targetSection: string;
}

const interstitialAdsPool: InterstitialAd[] = [
  {
    id: "int_bkash",
    brand: "বিকাশ অ্যাপ",
    title: "বিকাশে ক্যাশইন ফ্রি ও ১০০০ টাকা বোনাস!",
    rewardAmount: 3.50,
    durationSec: 5,
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
    gradientBg: "from-pink-600 via-rose-700 to-purple-900",
    tagline: "আজই বিকাশ অ্যাপ ডাউনলোড করে নিন ১০০০ টাকার নিশ্চিত ক্যাশব্যাক কুপন!",
    targetSection: "প্রাইভেট চ্যাট ও আড্ডা",
  },
  {
    id: "int_daraz",
    brand: "দারাজ অনলাইন শপিং",
    title: "দারাজ মেগা ঈদ সেল — ৮০% পর্যন্ত ছাড়!",
    rewardAmount: 4.00,
    durationSec: 5,
    thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800",
    gradientBg: "from-amber-600 via-orange-600 to-red-700",
    tagline: "বিনামূল্যে হোম ডেলিভারি ও দ্রুততম ডেলিভারি সারাদেশে!",
    targetSection: "ইসলামিক ও নসিহত কর্নার",
  },
  {
    id: "int_foodpanda",
    brand: "ফুডপান্ডা",
    title: "ফুডপান্ডায় প্রথম অর্ডারে ৫০% ক্যাশব্যাক!",
    rewardAmount: 3.00,
    durationSec: 4,
    thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    gradientBg: "from-pink-500 via-rose-600 to-amber-700",
    tagline: "৩০ মিনিটে গরম খাবার পৌঁছে যাবে আপনার দ্বারে!",
    targetSection: "খেলাধুলা ও লাইভ স্কোর",
  },
  {
    id: "int_robi",
    brand: "রবি ৪.৫জি",
    title: "রবি অল-ইন-ওয়ান ধামাকা ডাটা প্যাক!",
    rewardAmount: 5.00,
    durationSec: 5,
    thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    gradientBg: "from-red-600 via-red-800 to-slate-900",
    tagline: "দেশজুড়ে সুপারফাস্ট ফোরজি স্পিড এখন আপনার হাতের মুঠোয়!",
    targetSection: "ট্যুরিজম ও ভ্রমণ গাইড",
  },
  {
    id: "int_gp",
    brand: "গ্রামীণফোন",
    title: "মাইজিপি অ্যাপে ১০০ জিবির স্পেশাল অফার",
    rewardAmount: 4.50,
    durationSec: 5,
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    gradientBg: "from-blue-600 via-indigo-800 to-slate-950",
    tagline: "সেরা নেটওয়ার্ক কাভারেজে সব সময় সচল থাকুন!",
    targetSection: "আশেপাশের লোকজন খুঁজুন",
  },
];

export const InterstitialAdModal: React.FC = () => {
  const { activeTab, watchAdAndEarn, language } = useApp();

  const [currentAd, setCurrentAd] = useState<InterstitialAd | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [lastTabSeen, setLastTabSeen] = useState<string>("home");

  // Trigger interstitial ad whenever navigating to a non-home tab
  useEffect(() => {
    if (activeTab !== "home" && activeTab !== lastTabSeen) {
      setLastTabSeen(activeTab);
      
      // Select a random ad from pool
      const randomAd = interstitialAdsPool[Math.floor(Math.random() * interstitialAdsPool.length)];
      
      // Customize target section name according to tab
      const tabNames: Record<string, string> = {
        chat: "প্রাইভেট চ্যাট ও আড্ডা",
        islamic: "ইসলামিক কর্নার",
        sports: "খেলাধুলা ও আপডেট",
        tourism: "ভ্রমণ গাইড",
        people: "আশেপাশের মানুষ",
        circle: "চিনাবাদাম সার্কেল",
        map: "লাইভ ম্যাপ",
        profile: "প্রোফাইল পেজ",
      };

      const updatedAd = {
        ...randomAd,
        targetSection: tabNames[activeTab] || "নতুন সেকশন",
      };

      setCurrentAd(updatedAd);
      setTimeLeft(updatedAd.durationSec);
      setIsCompleted(false);
      setClaimed(false);
    }
  }, [activeTab, lastTabSeen]);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (currentAd && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (currentAd && timeLeft === 0) {
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [currentAd, timeLeft]);

  // Handle claiming the reward
  const handleClaim = () => {
    if (!currentAd || claimed) return;
    watchAdAndEarn(currentAd.rewardAmount, currentAd.title);
    setClaimed(true);
    setTimeout(() => {
      setCurrentAd(null);
    }, 600);
  };

  const handleClose = () => {
    if (!claimed && currentAd && isCompleted) {
      watchAdAndEarn(currentAd.rewardAmount, currentAd.title);
    }
    setCurrentAd(null);
  };

  if (!currentAd) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 20 }}
          className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-white"
        >
          {/* Top Banner Tag */}
          <div className={`p-4 bg-gradient-to-r ${currentAd.gradientBg} flex items-center justify-between shadow-md`}>
            <div className="flex items-center gap-2.5">
              <span className="bg-slate-950/40 p-2 rounded-2xl text-xl font-black">📺</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    বিজ্ঞাপন প্রবেশদ্বারে
                  </span>
                  <span className="text-[10px] text-amber-200 font-bold">
                    {currentAd.targetSection}-এ প্রবেশের সময়
                  </span>
                </div>
                <h3 className="font-black text-sm text-white mt-0.5">
                  {currentAd.brand} — {currentAd.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/40 hover:bg-black/60 rounded-xl transition text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Ad Visual Media Container */}
          <div className="relative h-60 bg-slate-950 flex flex-col items-center justify-center p-5 text-center overflow-hidden">
            <img
              src={currentAd.thumbnail}
              alt={currentAd.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
            />

            <div className="relative z-10 space-y-2 max-w-xs">
              <span className="inline-block bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg">
                স্পন্সরড রিওয়ার্ড ভিডিও
              </span>
              <h4 className="text-base font-black text-amber-200 drop-shadow-md">
                "{currentAd.tagline}"
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                সেকশনে প্রবেশের জন্য {timeLeft > 0 ? `${timeLeft} সেকেন্ড এড দেখুন` : "এড সম্পূর্ণ হয়েছে!"}
              </p>
            </div>

            {/* Reward Earn Overlay */}
            {claimed && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center z-20 space-y-2"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg animate-bounce">
                  🎉
                </div>
                <h4 className="text-base font-black text-emerald-400">
                  + ৳ {currentAd.rewardAmount.toFixed(2)} অর্জিত হয়েছে!
                </h4>
                <p className="text-xs text-slate-300">টাকা সরাসরি ওয়ালেটে জমা হয়েছে</p>
              </motion.div>
            )}

            {/* Countdown bar */}
            {!claimed && (
              <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {timeLeft}s
                </div>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-1000"
                    style={{
                      width: `${((currentAd.durationSec - timeLeft) / currentAd.durationSec) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-black">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>রিওয়ার্ড: + ৳ {currentAd.rewardAmount.toFixed(2)}</span>
            </div>

            {isCompleted ? (
              <button
                onClick={handleClaim}
                disabled={claimed}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg transition flex items-center gap-1.5 animate-bounce"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{claimed ? "ওয়ালেটে জমা হয়েছে ✅" : "পুরস্কার নিন ও প্রবেশ করুন ➡️"}</span>
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700"
              >
                এড স্কিপ করুন ({timeLeft}s)
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
