import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Coins,
  Play,
  Wallet,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Tv,
  Gift,
  Flame,
  X,
  Zap,
  Volume2,
  VolumeX,
  ShieldCheck,
  RefreshCw,
  History,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdTask {
  id: string;
  brand: string;
  title: string;
  titleEn: string;
  category: string;
  rewardAmount: number;
  durationSec: number;
  thumbnail: string;
  videoBg: string;
  tagline: string;
  type: "video" | "premium" | "spin";
  isCompleted?: boolean;
}

export const WatchAdsEarnSection: React.FC = () => {
  const {
    currentUser,
    watchAdAndEarn,
    requestWithdrawal,
    language,
    setActiveTab,
  } = useApp();

  // Single featured ad index on home screen
  const [featuredAdIndex, setFeaturedAdIndex] = useState<number>(0);

  // Active playing ad state
  const [activeAd, setActiveAd] = useState<AdTask | null>(null);
  const [adTimeLeft, setAdTimeLeft] = useState<number>(0);
  const [isAdCompleted, setIsAdCompleted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Drawers
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showSpinModal, setShowSpinModal] = useState<boolean>(false);

  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState<"bkash" | "nagad" | "rocket" | "recharge">("bkash");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("50");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [withdrawStatusMsg, setWithdrawStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Daily Streak State
  const [streakClaimed, setStreakClaimed] = useState<boolean>(false);

  // Spin wheel simulation
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinDeg, setSpinDeg] = useState<number>(0);
  const [spinReward, setSpinReward] = useState<number | null>(null);

  // Sponsored Ad Tasks List
  const [adList, setAdList] = useState<AdTask[]>([
    {
      id: "ad_1",
      brand: "দারাজ অনলাইন শপিং",
      title: "দারাজ মেগা ঈদ ধামাকা অফার",
      titleEn: "Daraz Mega Sale Video",
      category: "স্পেশাল ভিডিও",
      rewardAmount: 6.00,
      durationSec: 8,
      thumbnail: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800",
      videoBg: "from-amber-600 via-orange-600 to-red-700",
      tagline: "আজই কেনাকাটায় ৭৫% পর্যন্ত ছাড় উপভোগ করুন!",
      type: "video",
    },
    {
      id: "ad_2",
      brand: "বিকাশ অ্যাপ",
      title: "বিকাশ ক্যাশইন ও সেন্ড মানি বোনাস",
      titleEn: "bKash Cashback Special",
      category: "অফার ভিডিও",
      rewardAmount: 8.00,
      durationSec: 10,
      thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
      videoBg: "from-pink-600 via-rose-700 to-purple-900",
      tagline: "বিকাশ দিয়ে কেনাকাটায় পান ১০০% নিশ্চিত রিওয়ার্ড!",
      type: "video",
    },
    {
      id: "ad_3",
      brand: "ফুডপান্ডা ডেলিভারি",
      title: "ফুডপান্ডা মচমচে বিকেলের নাস্তা এড",
      titleEn: "Foodpanda Evening Snacks",
      category: "কুইক এড",
      rewardAmount: 5.00,
      durationSec: 6,
      thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
      videoBg: "from-pink-500 via-rose-600 to-amber-700",
      tagline: "৩০ মিনিটে আপনার ঘরের দরজায় গরম নাস্তা!",
      type: "video",
    },
    {
      id: "ad_4",
      brand: "রবি ৪.৫জি নেটওয়ার্ক",
      title: "রবি অল-ইন-ওয়ান ইন্টারনেট প্যাক",
      titleEn: "Robi 4.5G Internet Offer",
      category: "প্রিমিয়াম এড",
      rewardAmount: 10.00,
      durationSec: 12,
      thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      videoBg: "from-red-600 via-red-800 to-slate-900",
      tagline: "দেশজুড়ে সুপারফাস্ট ফোরজি স্পিড এখন হাতের মুঠোয়!",
      type: "premium",
    },
  ]);

  const currentFeaturedAd = adList[featuredAdIndex] || adList[0];

  // Rotate to Next Ad on Home screen
  const handleNextAd = () => {
    setFeaturedAdIndex((prev) => (prev + 1) % adList.length);
  };

  // Timer Effect for active watching ad
  useEffect(() => {
    let timer: any = null;
    if (activeAd && adTimeLeft > 0) {
      timer = setInterval(() => {
        setAdTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (activeAd && adTimeLeft === 0) {
      setIsAdCompleted(true);
    }
    return () => clearInterval(timer);
  }, [activeAd, adTimeLeft]);

  // Start Watching Ad
  const handleStartAd = (ad: AdTask) => {
    setActiveAd(ad);
    setAdTimeLeft(ad.durationSec);
    setIsAdCompleted(false);
  };

  // Complete & Claim Reward
  const handleClaimReward = () => {
    if (!activeAd) return;
    watchAdAndEarn(activeAd.rewardAmount, activeAd.title);
    
    // Mark completed in list
    setAdList((prev) =>
      prev.map((a) => (a.id === activeAd.id ? { ...a, isCompleted: true } : a))
    );

    setActiveAd(null);
    setIsAdCompleted(false);

    // Auto rotate to next ad for continuous earning
    handleNextAd();
  };

  // Claim Daily Streak
  const handleClaimStreak = () => {
    if (streakClaimed) return;
    watchAdAndEarn(10.00, "দৈনিক বোনাস রিওয়ার্ড");
    setStreakClaimed(true);
  };

  // Handle Withdraw Submission
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawStatusMsg({
        success: false,
        text: language === "bn" ? "সঠিক পরিমাণ লিখুন।" : "Enter valid amount.",
      });
      return;
    }

    const res = requestWithdrawal(amt, withdrawMethod, accountNumber);
    setWithdrawStatusMsg({ success: res.success, text: res.message });

    if (res.success) {
      setAccountNumber("");
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatusMsg(null);
      }, 2500);
    }
  };

  // Spin Wheel Handler
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinReward(null);

    const randomDeg = 1440 + Math.floor(Math.random() * 360);
    setSpinDeg(randomDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const possibleRewards = [2, 5, 8, 10, 15, 20];
      const winAmt = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
      setSpinReward(winAmt);
      watchAdAndEarn(winAmt, "স্পিন এড পুরস্কার");
    }, 3500);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 rounded-3xl p-4 sm:p-5 text-white border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER BAR */}
      <div className="flex items-center justify-between flex-wrap gap-2 relative z-10 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-xl">
              💰
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{language === "bn" ? "হোম এড ও রিওয়ার্ড সেন্টার" : "Home Ad & Reward Center"}</span>
              </h2>
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                ১০০% রিয়েল পেআউট
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 font-medium">
              বিজ্ঞাপন দেখুন, পয়েন্ট আয় করুন এবং বিকাশ/নগদে ক্যাশআউট করুন
            </p>
          </div>
        </div>

        {/* Action History Ledger Button */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === "bn" ? "উত্তোলন ইতিহাস" : "Withdraw Ledger"}</span>
        </button>
      </div>

      {/* WALLET BALANCE & WITHDRAW BANNER */}
      <div className="bg-gradient-to-r from-slate-800/90 via-amber-900/40 to-slate-800/90 border border-amber-400/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div>
          <span className="text-[11px] font-bold text-amber-300/80 uppercase tracking-widest flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === "bn" ? "আপনার ওয়ালেট ব্যালেন্স" : "Wallet Balance"}</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5 flex items-baseline gap-2">
            <span>৳ {currentUser.walletBalance.toFixed(2)}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              আজকে আয়: ৳{currentUser.todayEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowSpinModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-black transition border border-indigo-400/40 shadow-sm flex items-center gap-1"
          >
            <span>🎡 স্পিন করুন</span>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 text-xs border border-emerald-300/50"
          >
            <ArrowUpRight className="w-4 h-4 font-black" />
            <span>{language === "bn" ? "টাকা তুলুন (বিকাশ/নগদ)" : "Withdraw Cash"}</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC SINGLE FEATURED SPONSORED AD CARD ON HOME SCREEN */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-black text-white flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>{language === "bn" ? "আজকের স্পন্সরড ভিডিও এড (হোম স্কিন)" : "Today's Featured Sponsored Ad"}</span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-300/90 font-extrabold bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/30">
              এড {featuredAdIndex + 1}/{adList.length}
            </span>

            {/* Next Ad Switcher */}
            <button
              onClick={handleNextAd}
              className="text-[11px] font-bold text-amber-300 hover:text-white bg-slate-800/90 border border-amber-500/30 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>{language === "bn" ? "পরবর্তী এড" : "Next Ad"}</span>
            </button>
          </div>
        </div>

        {/* Featured Card */}
        <div className="bg-slate-900/90 border border-amber-400/50 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 gap-0 relative">
          
          {/* Ad Image / Preview (5 Cols) */}
          <div className="md:col-span-5 relative h-48 md:h-auto overflow-hidden bg-slate-950">
            <img
              src={currentFeaturedAd.thumbnail}
              alt={currentFeaturedAd.title}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

            <span className="absolute top-2.5 left-2.5 bg-slate-950/80 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-amber-500/30 backdrop-blur-xs">
              {currentFeaturedAd.brand}
            </span>

            <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
              + ৳ {currentFeaturedAd.rewardAmount.toFixed(2)}
            </span>
          </div>

          {/* Ad Details & Play Action (7 Cols) */}
          <div className="md:col-span-7 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-500/30">
                  {currentFeaturedAd.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{currentFeaturedAd.durationSec} সেকেন্ড ভিডিও</span>
                </span>
              </div>

              <h4 className="font-extrabold text-base text-white mt-1">
                {currentFeaturedAd.title}
              </h4>

              <p className="text-xs text-amber-200/90 font-medium mt-1">
                "{currentFeaturedAd.tagline}"
              </p>
            </div>

            {/* Watch Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-300 font-bold">
                পুরস্কার: <span className="text-amber-300 font-black">৳ {currentFeaturedAd.rewardAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => handleStartAd(currentFeaturedAd)}
                disabled={currentFeaturedAd.isCompleted}
                className={`px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-md ${
                  currentFeaturedAd.isCompleted
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95"
                }`}
              >
                {currentFeaturedAd.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>সম্পন্ন ও টাকা জমা ✅</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>এড দেখুন (+৳ {currentFeaturedAd.rewardAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLANATION BANNER ABOUT DYNAMIC INTERSTITIAL ADS ACROSS OTHER SECTIONS */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-300 block">💡 অটোমেটিক এড ইনকাম সিস্টেম:</span>
            <span className="text-[11px]">
              চ্যাট, ইসলামিক কর্নার, খেলাধুলা বা অন্যান্য অপশনে ঢুকলেই পপ-আপ এড আসবে এবং সাথে সাথে আপনার ওয়ালেটে টাকা যোগ হবে!
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("chat")}
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold shrink-0 text-[11px] flex items-center gap-1"
        >
          <span>আড্ডায় ঢুকুন</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* MODAL 1: FULLSCREEN AD PLAYER SIMULATION */}
      <AnimatePresence>
        {activeAd && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Top Ad Simulation Banner */}
              <div className={`p-4 bg-gradient-to-r ${activeAd.videoBg} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 p-1.5 rounded-xl text-lg font-black">📺</span>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-200 font-extrabold block">
                      {activeAd.brand} — স্পন্সরড ভিডিও
                    </span>
                    <h3 className="font-black text-sm text-white">
                      {activeAd.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-black/30 hover:bg-black/50 rounded-xl text-white transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Video Player Canvas View */}
              <div className="relative h-64 bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <img
                  src={activeAd.thumbnail}
                  alt="Ad preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xs"
                />

                {/* Video Content Overlay */}
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl animate-pulse">
                    🎬
                  </div>
                  <h4 className="text-lg font-black text-amber-300 drop-shadow-md max-w-xs">
                    "{activeAd.tagline}"
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xs font-medium">
                    বিজ্ঞাপন চলাকালীন স্ক্রিন বন্ধ করবেন না। সময় শেষ হলে রিওয়ার্ড জমা হবে।
                  </p>
                </div>

                {/* Live Countdown & Progress Bar */}
                <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    {adTimeLeft}s
                  </div>
                  <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-1000"
                      style={{
                        width: `${((activeAd.durationSec - adTimeLeft) / activeAd.durationSec) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Action */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>পুরস্কার: ৳ {activeAd.rewardAmount.toFixed(2)}</span>
                </div>

                {isAdCompleted ? (
                  <button
                    onClick={handleClaimReward}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg transition animate-bounce text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>রিওয়ার্ড নিন (৳ {activeAd.rewardAmount.toFixed(2)})</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-bold bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                    অপেক্ষা করুন ({adTimeLeft} সেকেন্ড)...
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CASH OUT WITHDRAWAL FORM */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">
                    💸
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">
                      {language === "bn" ? "ইনকামকৃত টাকা তুলুন" : "Withdraw Earned Money"}
                    </h3>
                    <p className="text-[10px] text-amber-300">
                      মোট ব্যালেন্স: ৳ {currentUser.walletBalance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
                {/* Method Selector */}
                <div>
                  <label className="text-xs font-extrabold text-slate-300 block mb-1.5">
                    উত্তোলন পদ্ধতি বেছে নিন:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bkash", name: "বিকাশ (bKash)", color: "border-pink-500 bg-pink-950/40" },
                      { id: "nagad", name: "নগদ (Nagad)", color: "border-orange-500 bg-orange-950/40" },
                      { id: "rocket", name: "রকেট (Rocket)", color: "border-purple-500 bg-purple-950/40" },
                      { id: "recharge", name: "মোবাইল রিচার্জ", color: "border-blue-500 bg-blue-950/40" },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setWithdrawMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold transition text-left flex items-center justify-between ${
                          withdrawMethod === m.id
                            ? `${m.color} text-white shadow-md ring-2 ring-amber-400/50`
                            : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span>{m.name}</span>
                        {withdrawMethod === m.id && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Amount */}
                <div>
                  <label className="text-xs font-extrabold text-slate-300 block mb-1.5">
                    টাকার পরিমাণ (নূন্যতম ৳৫০.০০):
                  </label>
                  <div className="flex items-center gap-1.5 mb-2">
                    {["50", "100", "200", "500"].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setWithdrawAmount(preset)}
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition ${
                          withdrawAmount === preset
                            ? "bg-amber-500 text-slate-950 border-amber-400"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        ৳ {preset}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="টাকার পরিমাণ লিখুন"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-extrabold text-amber-300 focus:outline-amber-500"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="text-xs font-extrabold text-slate-300 block mb-1">
                    অ্যাকাউন্ট / মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="উদাহরণ: 01712345678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-extrabold text-white focus:outline-amber-500"
                  />
                </div>

                {/* Status Feedback */}
                {withdrawStatusMsg && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-bold border ${
                      withdrawStatusMsg.success
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                        : "bg-red-950/80 text-red-300 border-red-500/50"
                    }`}
                  >
                    {withdrawStatusMsg.text}
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 rounded-xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ক্যাশআউট অনুরোধ নিশ্চিত করুন</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: WITHDRAWAL LEDGER HISTORY */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-sm text-white">
                    {language === "bn" ? "উত্তোলন ও অর্থ প্রদানের হিস্টোরি" : "Withdrawal & Payout History"}
                  </h3>
                </div>

                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {currentUser.withdrawHistory.length > 0 ? (
                  currentUser.withdrawHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-300 text-sm">৳ {rec.amount}</span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                            {rec.method}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          নম্বর: {rec.accountNumber} • {rec.timestamp}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          rec.status === "completed"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-500/40"
                            : "bg-amber-950 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {rec.status === "completed" ? "সফল ✅" : "প্রসেসিং ⏳"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">
                    এখনও কোনো উত্তোলনের রেকর্ড নেই।
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: LUCKY SPIN & EARN WHEEL */}
      <AnimatePresence>
        {showSpinModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 text-center space-y-4 shadow-2xl relative text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  🎡 স্পিন এন্ড উইন এড চাকা
                </span>
                <button onClick={() => setShowSpinModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wheel Graphic */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
                <div
                  className="w-full h-full rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-600 via-orange-600 to-indigo-800 transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.25, 1) shadow-2xl flex items-center justify-center text-2xl font-black"
                  style={{ transform: `rotate(${spinDeg}deg)` }}
                >
                  🎯
                </div>
                <div className="absolute top-0 text-amber-300 font-black text-xl -mt-2">
                  ▼
                </div>
              </div>

              {spinReward && (
                <div className="bg-emerald-950 border border-emerald-500/50 p-2.5 rounded-2xl text-xs font-black text-emerald-300 animate-bounce">
                  🎉 অভিনন্দন! আপনি ৳ {spinReward}.০০ জিতেছে এবং ওয়ালেটে জমা হয়েছে!
                </div>
              )}

              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg transition active:scale-95"
              >
                {isSpinning ? "চাকা ঘুরছে..." : "স্পিন করুন (+বিজ্ঞাপন রিওয়ার্ড)"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
