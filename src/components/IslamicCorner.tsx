import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Compass,
  Moon,
  Sun,
  Clock,
  MapPin,
  Navigation,
  BookOpen,
  Search,
  Check,
  LocateFixed,
  Building,
  Home,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sunrise,
  Sunset,
  AlertTriangle,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BANGLADESH_DIVISIONS,
  BASE_DHAKA_PRAYER_TIMES,
  formatTimeFromMinutes,
  Division,
  District,
  Thana
} from "../data/bangladeshLocations";
import { GpsJourneyPrayerTracker } from "./GpsJourneyPrayerTracker";

export const IslamicCorner: React.FC = () => {
  const { mosques, t, language } = useApp();

  const [activeTab, setActiveTabLocal] = useState<"times" | "sunrise" | "qibla" | "mosques" | "hadith">("times");
  const [compassAngle, setCompassAngle] = useState(240); // 240 deg for Dhaka Qibla angle from North

  // Hierarchy Selection States
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("dhaka");
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("ঢাকা");
  const [selectedThanaName, setSelectedThanaName] = useState<string>("ধানমন্ডি");
  const [villageName, setVillageName] = useState<string>("");
  const [customOffset, setCustomOffset] = useState<number>(0); // Village fine-tune +/- minutes

  // Search & Auto-Detect States
  const [quickSearch, setQuickSearch] = useState<string>("");
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string>("");

  // Get current objects
  const currentDivision: Division =
    BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivisionId) || BANGLADESH_DIVISIONS[0];

  const currentDistrict: District =
    currentDivision.districts.find((dist) => dist.nameBn === selectedDistrictName) ||
    currentDivision.districts[0];

  const currentThanas: Thana[] = currentDistrict.thanas || [];

  // Handle Division Change
  const handleDivisionChange = (divId: string) => {
    setSelectedDivisionId(divId);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.id === divId) || BANGLADESH_DIVISIONS[0];
    if (divObj.districts.length > 0) {
      setSelectedDistrictName(divObj.districts[0].nameBn);
      if (divObj.districts[0].thanas.length > 0) {
        setSelectedThanaName(divObj.districts[0].thanas[0].nameBn);
      } else {
        setSelectedThanaName("");
      }
    }
  };

  // Handle District Change
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrictName(distName);
    const distObj = currentDivision.districts.find((d) => d.nameBn === distName);
    if (distObj && distObj.thanas.length > 0) {
      setSelectedThanaName(distObj.thanas[0].nameBn);
    } else {
      setSelectedThanaName("");
    }
  };

  // Total Offset = District Base Offset + Custom Village Fine-tune
  const totalOffsetMinutes = currentDistrict.offsetMinutes + customOffset;

  // Calculate Prayer Schedule for Selected Location
  const calculatedPrayerSchedule = BASE_DHAKA_PRAYER_TIMES.map((item) => {
    const adjustedMinutes = item.baseMinutes + totalOffsetMinutes;
    return {
      ...item,
      time: formatTimeFromMinutes(adjustedMinutes),
      adjustedMinutes,
    };
  });

  // Calculate Next Prayer
  const now = new Date();
  const currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();

  let nextPrayer = calculatedPrayerSchedule.find(
    (p) => p.adjustedMinutes > currentMinutesFromMidnight && p.id !== "jummah"
  );

  if (!nextPrayer) {
    nextPrayer = calculatedPrayerSchedule[0]; // Fajr next day
  }

  const minsRemaining = nextPrayer
    ? nextPrayer.adjustedMinutes > currentMinutesFromMidnight
      ? nextPrayer.adjustedMinutes - currentMinutesFromMidnight
      : nextPrayer.adjustedMinutes + 1440 - currentMinutesFromMidnight
    : 0;

  // ---------------------------------------------------------------------------
  // Live Sunrise & Sun Elevation Dynamics (সূর্যোদয়ের বাস্তব উদয় ট্র্যাকার)
  // ---------------------------------------------------------------------------
  // Fajr base is 310 min. Sunrise starts ~325 min (5:25 AM base + totalOffsetMinutes)
  const sunriseStartMin = 325 + totalOffsetMinutes; 
  const sunriseEndMin = 345 + totalOffsetMinutes; // 20 minute sunrise duration (5:45 AM base)
  const sunsetMin = 1135 + totalOffsetMinutes; // 6:55 PM base + totalOffsetMinutes

  const [isSimulatingTime, setIsSimulatingTime] = useState<boolean>(false);
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(sunriseStartMin + 10); // Default 50% half-sun
  const [isAutoPlayingSunrise, setIsAutoPlayingSunrise] = useState<boolean>(false);

  // Auto-play timer for sunrise elevation animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlayingSunrise) {
      timer = setInterval(() => {
        setSimulatedMinutes((prev) => {
          if (prev >= sunriseEndMin + 10) {
            return sunriseStartMin - 5;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isAutoPlayingSunrise, sunriseStartMin, sunriseEndMin]);

  // Active time for calculating sun elevation percentage
  const activeMinutes = isSimulatingTime ? simulatedMinutes : currentMinutesFromMidnight;

  // Calculate Sun Elevation Percentage (0% to 100%)
  let sunRisePercentage = 0;
  let sunStatusTitleBn = "";
  let sunStatusDescBn = "";
  let sunIslamicRuleBn = "";

  if (activeMinutes < sunriseStartMin) {
    sunRisePercentage = 0;
    sunStatusTitleBn = "সূর্য এখনও দিগন্তের নিচে (সূর্যোদয় শুরু হয়নি)";
    sunStatusDescBn = "ফজরের সময় চলমান অথবা রাত্রিকাল। সূর্য দিগন্ত রেখার নিচে অবস্থান করছে।";
    sunIslamicRuleBn = "ফজরের সালাত আদায়ের সময়।";
  } else if (activeMinutes >= sunriseStartMin && activeMinutes <= sunriseEndMin) {
    const progressRatio = (activeMinutes - sunriseStartMin) / (sunriseEndMin - sunriseStartMin);
    sunRisePercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

    if (sunRisePercentage === 0) {
      sunStatusTitleBn = "সূর্যোদয় শুরু হচ্ছে (০% দৃশ্যমান)";
      sunStatusDescBn = "সূর্যের একদম শীর্ষভাগ দিগন্ত রেখাকে স্পর্শ করেছে।";
      sunIslamicRuleBn = "⚠️ মাকরূহ সময় শুরু: সূর্য সম্পূর্ণ উদিত না হওয়া পর্যন্ত কোনো নামায পড়া যাবে না।";
    } else if (sunRisePercentage < 40) {
      sunStatusTitleBn = `সূর্যের উপরিভাগ দিগন্তের উপরে দৃশ্যমান (${sunRisePercentage}%)`;
      sunStatusDescBn = `পূর্ব দিগন্তে সূর্য উদিত হচ্ছে। দিগন্তের উপরে প্রায় ${sunRisePercentage}% সূর্য দেখা যাচ্ছে।`;
      sunIslamicRuleBn = "⚠️ মাকরূহ সময়: সর্বপ্রকার নামায আদায় করা সম্পূর্ণ নিষিদ্ধ বা মাকরূহ।";
    } else if (sunRisePercentage < 70) {
      sunStatusTitleBn = `অর্ধেক সূর্য উদিত হয়েছে (${sunRisePercentage}%)`;
      sunStatusDescBn = `দিগন্ত রেখার ঠিক মাঝামাঝি স্থানে সূর্য অবস্থান করছে। ${sunRisePercentage}% অংশ উদিত হয়েছে।`;
      sunIslamicRuleBn = "⚠️ মাকরূহ সময়: নামায পড়া নিষিদ্ধ।";
    } else if (sunRisePercentage < 100) {
      sunStatusTitleBn = `সূর্য প্রায় সম্পূর্ণ উদিত (${sunRisePercentage}%)`;
      sunStatusDescBn = `সূর্যের ${sunRisePercentage}% গোলাকার অংশ দিগন্ত রেখা ভেদ করে উপরে উঠে এসেছে।`;
      sunIslamicRuleBn = "⚠️ মাকরূহ সময়: সূর্য সম্পূর্ণ উদয় হওয়া পর্যন্ত অপেক্ষা করুন।";
    } else {
      sunStatusTitleBn = "পূর্ণ সূর্যোদয় সম্পন্ন! (১০০% উদিত)";
      sunStatusDescBn = "সূর্যের পুরো থালাটি দিগন্ত রেখা থেকে সম্পূর্ণ উপরে উঠে এসেছে।";
      sunIslamicRuleBn = "✅ মাকরূহ সময় শেষ। ইশরাকের নামাযের সময় নিকটবর্তী।";
    }
  } else if (activeMinutes > sunriseEndMin && activeMinutes <= sunsetMin) {
    sunRisePercentage = 100;
    sunStatusTitleBn = "সূর্য সম্পূর্ণ আকাশে উদিত (১০০% আলোছায়া)";
    sunStatusDescBn = "সূর্য দিগন্ত ছাড়িয়ে আকাশে কিরণ দিচ্ছে। দিন বা প্রহরের সালাত আদায়ের সময়।";
    sunIslamicRuleBn = "✅ চাশত / দ্বুহা ও যোহরের সালাত আদায়ের সময়।";
  } else {
    sunRisePercentage = 0;
    sunStatusTitleBn = "সূর্যাস্ত হয়ে গেছে (রাত্রিকাল)";
    sunStatusDescBn = "সূর্য পশ্চিম দিগন্তের নিচে নেমে গেছে।";
    sunIslamicRuleBn = "মাগরিব ও এশার সালাত আদায়ের সময়।";
  }

  // Calculate SVG Sun Y Center coordinate for Horizon Graphic
  // Radius R = 36. Horizon Y = 110.
  // 0% -> cy = 146 (Top touches Y=110, completely below ground)
  // 50% -> cy = 110 (Center on Y=110, half above, half below)
  // 100% -> cy = 74 (Bottom touches Y=110, fully above ground)
  const sunRadius = 36;
  const horizonY = 110;
  const sunCenterY = horizonY + sunRadius - (sunRisePercentage / 100) * (2 * sunRadius);

  // GPS Auto Detect
  const handleDetectGpsLocation = () => {
    setIsGpsLoading(true);
    setLocationStatusMsg(
      language === "bn" ? "আপনার জিপিএস ও বর্তমান অবস্থান নির্ণয় করা হচ্ছে..." : "Detecting GPS location..."
    );

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsLoading(false);
          const lat = pos.coords.latitude;

          if (lat < 23.0) {
            handleDivisionChange("chattogram");
            setSelectedDistrictName("চট্টগ্রাম");
            setSelectedThanaName("কোতোয়ালী");
            setVillageName("বন্দর এলাকা / গ্রাম");
          } else if (lat > 24.5) {
            handleDivisionChange("sylhet");
            setSelectedDistrictName("সিলেট");
            setSelectedThanaName("সিলেট সদর");
            setVillageName("গ্রাম/মহল্লা");
          } else {
            handleDivisionChange("dhaka");
            setSelectedDistrictName("ঢাকা");
            setSelectedThanaName("মিরপুর");
            setVillageName("আমার গ্রাম / জিপিএস লোকেশন");
          }

          setLocationStatusMsg(
            language === "bn"
              ? "সফলভাবে আপনার জেলা ও থানা অনুযায়ী সময়সূচী প্রস্তুত করা হয়েছে!"
              : "Successfully set prayer time for detected location!"
          );
        },
        (err) => {
          setIsGpsLoading(false);
          setLocationStatusMsg(
            language === "bn"
              ? "জিপিএস লোকেশন পাওয়া যায়নি, ম্যানুয়ালি বিভাগ ও জেলা নির্বাচন করুন।"
              : "GPS location unavailable, please select manually."
          );
        },
        { timeout: 5000 }
      );
    } else {
      setIsGpsLoading(false);
      setLocationStatusMsg(
        language === "bn"
          ? "আপনার ডিভাইসে জিপিএস সাপোর্ট করছে না।"
          : "GPS not supported on your browser."
      );
    }
  };

  // Quick Search Filter for Thana/District/Village
  const handleQuickSearch = (term: string) => {
    setQuickSearch(term);
    if (!term.trim()) return;

    for (const div of BANGLADESH_DIVISIONS) {
      for (const dist of div.districts) {
        if (
          dist.nameBn.includes(term) ||
          dist.nameEn.toLowerCase().includes(term.toLowerCase())
        ) {
          setSelectedDivisionId(div.id);
          setSelectedDistrictName(dist.nameBn);
          if (dist.thanas.length > 0) setSelectedThanaName(dist.thanas[0].nameBn);
          return;
        }

        for (const th of dist.thanas) {
          if (
            th.nameBn.includes(term) ||
            th.nameEn.toLowerCase().includes(term.toLowerCase())
          ) {
            setSelectedDivisionId(div.id);
            setSelectedDistrictName(dist.nameBn);
            setSelectedThanaName(th.nameBn);
            return;
          }
        }
      }
    }
  };

  const dailyHadith = {
    title: language === "bn" ? "আজকের হাদিস" : "Hadith of the Day",
    text:
      language === "bn"
        ? "রাসূলুল্লাহ (সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম) বলেছেন: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে আখলাক বা চরিত্রের দিক দিয়ে সবচেয়ে উত্তম।'"
        : "The Messenger of Allah (pbuh) said: 'The best among you are those who have the best manners and character.'",
    source: "সহীহ বুখারী (Sahih Bukhari - 6035)",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-4 bottom-2 opacity-15 text-8xl font-serif pointer-events-none">
          🕌
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕌</span>
            <div>
              <h2 className="text-xl font-black tracking-wide">
                {language === "bn" ? "সারা দেশের নামাজের সময়সূচী ও সূর্যোদয় ট্র্যাকার" : "Bangladesh All Location Prayer & Sunrise Schedule"}
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {language === "bn"
                  ? "বাংলাদেশের ৬৪ জেলা, সকল থানা ও গ্রামের নিখুঁত সময়সূচী এবং লাইভ সূর্য উদয় অ্যানিমেশন"
                  : "Accurate prayer schedule for all Divisions & live visual sunrise level"}
              </p>
            </div>
          </div>

          {/* Next Prayer Live Widget */}
          <div className="mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">{nextPrayer.icon}</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-200 block">
                  {language === "bn" ? "পরবর্তী নামায" : "Next Prayer"}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base">
                  {language === "bn"
                    ? `${nextPrayer.nameBn} — ${nextPrayer.time}`
                    : `${nextPrayer.nameEn} — ${nextPrayer.time}`}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
                ⏰ {language === "bn" ? `বাকি ${minsRemaining} মিনিট` : `In ${minsRemaining} mins`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-1">
        <button
          onClick={() => setActiveTabLocal("times")}
          className={`py-2 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
            activeTab === "times" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🕌</span>
          <span>{language === "bn" ? "সময়সূচী" : "Schedule"}</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("sunrise")}
          className={`py-2 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
            activeTab === "sunrise" ? "bg-amber-600 text-white shadow-xs" : "text-amber-800 bg-amber-50 hover:bg-amber-100"
          }`}
        >
          <span>🌅</span>
          <span className="flex items-center gap-1">
            {language === "bn" ? "সূর্যোদয় (সজীব)" : "Sunrise Live"}
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          </span>
        </button>

        <button
          onClick={() => setActiveTabLocal("qibla")}
          className={`py-2 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
            activeTab === "qibla" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🧭</span>
          <span>{language === "bn" ? "কিবলা" : "Qibla"}</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("mosques")}
          className={`py-2 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
            activeTab === "mosques" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>📍</span>
          <span>{language === "bn" ? "মসজিদ" : "Mosques"}</span>
        </button>

        <button
          onClick={() => setActiveTabLocal("hadith")}
          className={`py-2 px-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1 ${
            activeTab === "hadith" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>📖</span>
          <span>{language === "bn" ? "হাদিস" : "Hadith"}</span>
        </button>
      </div>

      {/* 1. Prayer Times Schedule with All Bangladesh Location Selection */}
      {activeTab === "times" && (
        <div className="space-y-4">
          
          {/* GPS Journey & Satellite Prayer Times Tracker */}
          <GpsJourneyPrayerTracker />

          {/* Featured Live Sunrise Quick Card */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4.5 rounded-3xl shadow-md border border-amber-300 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 z-10">
              
              {/* Mini Sun Sphere Level Indicator */}
              <div className="relative w-16 h-16 rounded-full border-2 border-white/80 bg-black/20 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-amber-400 via-yellow-300 to-orange-200 transition-all duration-300"
                  style={{ height: `${sunRisePercentage}%` }}
                ></div>
                <span className="relative z-10 font-black text-xs text-slate-900 drop-shadow-xs bg-white/90 px-1.5 py-0.5 rounded-full">
                  {sunRisePercentage}%
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-100" />
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-100">
                    {language === "bn" ? "সূর্যোদয় ও দিগন্ত অবস্থান" : "Sunrise Visual Status"}
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base mt-0.5">
                  {sunStatusTitleBn}
                </h4>
                <p className="text-xs text-amber-100 font-medium line-clamp-1">
                  {selectedDistrictName} এলাকায় সূর্যোদয়: {formatTimeFromMinutes(sunriseStartMin)} হতে {formatTimeFromMinutes(sunriseEndMin)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTabLocal("sunrise")}
              className="z-10 bg-white text-amber-900 hover:bg-amber-50 font-black text-xs px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-1.5 shrink-0 transition active:scale-95"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>{language === "bn" ? "সজীব সূর্যোদয় অ্যানিমেশন দেখুন" : "View Live Sunrise Graphic"}</span>
            </button>
          </div>

          {/* Location Picker Box */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {language === "bn" ? "আপনার অবস্থান নির্বাচন করুন (বিভাগ/জেলা/থানা/গ্রাম)" : "Select Location (Division/District/Thana/Village)"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {language === "bn"
                      ? "বাংলাদেশের ৬৪ টি জেলা ও সকল থানার সঠিক সময়সূচী"
                      : "Accurate timings for all 64 districts & all upazilas"}
                  </p>
                </div>
              </div>

              {/* GPS Auto Detect Button */}
              <button
                onClick={handleDetectGpsLocation}
                disabled={isGpsLoading}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition shrink-0 active:scale-95"
              >
                <LocateFixed className={`w-4 h-4 text-emerald-700 ${isGpsLoading ? "animate-spin" : ""}`} />
                <span>{language === "bn" ? "জিপিএস অটো ডিটেক্ট" : "Auto-Detect GPS"}</span>
              </button>
            </div>

            {locationStatusMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold p-2.5 rounded-xl">
                {locationStatusMsg}
              </div>
            )}

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => handleQuickSearch(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "যেকোনো জেলা বা থানার নাম লিখে দ্রুত খুঁজুন (যেমন: মিরপুর, পটিয়া, শ্রীমঙ্গল)..."
                    : "Search any district or upazila (e.g., Mirpur, Patiya, Sreemangal)..."
                }
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-slate-200"
              />
            </div>

            {/* 4-Level Location Hierarchy Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              
              {/* 1. Division Selector */}
              <div>
                <label className="text-[11px] font-black text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === "bn" ? "১. বিভাগ নির্বাচন করুন" : "1. Select Division"}</span>
                </label>
                <select
                  value={selectedDivisionId}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div.id} value={div.id}>
                      {language === "bn" ? div.nameBn : div.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District Selector */}
              <div>
                <label className="text-[11px] font-black text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === "bn" ? "২. জেলা নির্বাচন করুন" : "2. Select District"}</span>
                </label>
                <select
                  value={selectedDistrictName}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {currentDivision.districts.map((dist) => (
                    <option key={dist.nameBn} value={dist.nameBn}>
                      {dist.nameBn} ({dist.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Thana / Upazila Selector */}
              <div>
                <label className="text-[11px] font-black text-slate-700 mb-1 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === "bn" ? "৩. থানা / উপজেলা" : "3. Thana / Upazila"}</span>
                </label>
                <select
                  value={selectedThanaName}
                  onChange={(e) => setSelectedThanaName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {currentThanas.map((th) => (
                    <option key={th.nameBn} value={th.nameBn}>
                      {th.nameBn} ({th.nameEn})
                    </option>
                  ))}
                  {currentThanas.length === 0 && (
                    <option value="">{language === "bn" ? "সদর থানা" : "Sadar Thana"}</option>
                  )}
                </select>
              </div>

              {/* 4. Village / Union / Custom Location Input */}
              <div>
                <label className="text-[11px] font-black text-slate-700 mb-1 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === "bn" ? "৪. গ্রাম / ইউনিয়ন / ওয়ার্ড" : "4. Village / Union / Ward"}</span>
                </label>
                <input
                  type="text"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder={
                    language === "bn" ? "আপনার গ্রামের নাম লিখুন..." : "Enter village name..."
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

            </div>

            {/* Fine-tune Minute Offset Adjustment for Rural Villages */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    {language === "bn"
                      ? "গ্রামীন সূক্ষ্ম সময় সমন্বয় (Fine Minute Offset):"
                      : "Rural Village Fine Adjustment:"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {language === "bn"
                      ? "ঢাকার সাপেক্ষে আপনার এলাকার সময় পার্থক্য:"
                      : "Offset compared to Dhaka standard:"}{" "}
                    <strong className="text-emerald-700">
                      {totalOffsetMinutes >= 0 ? `+${totalOffsetMinutes}` : totalOffsetMinutes} মিনিট
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCustomOffset((prev) => prev - 1)}
                  className="w-7 h-7 bg-white border border-slate-300 rounded-lg font-black text-sm text-slate-800 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                  title="১ মিনিট কমান"
                >
                  -
                </button>
                <span className="text-xs font-black px-2 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
                  {customOffset >= 0 ? `+${customOffset}` : customOffset} মি.
                </span>
                <button
                  onClick={() => setCustomOffset((prev) => prev + 1)}
                  className="w-7 h-7 bg-white border border-slate-300 rounded-lg font-black text-sm text-slate-800 hover:bg-slate-100 active:scale-95 flex items-center justify-center"
                  title="১ মিনিট বাড়ান"
                >
                  +
                </button>
              </div>
            </div>

            {/* Active Selected Location Banner */}
            <div className="bg-emerald-800 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <div>
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                    {language === "bn" ? "নির্বাচিত বর্তমান ঠিকানা:" : "Selected Address:"}
                  </span>
                  <span className="font-black text-sm">
                    {villageName ? `${villageName}, ` : ""}
                    {selectedThanaName ? `${selectedThanaName}, ` : ""}
                    {selectedDistrictName}, {currentDivision.nameBn}
                  </span>
                </div>
              </div>

              <span className="text-xs font-extrabold bg-amber-400 text-slate-950 px-3 py-1 rounded-xl shadow-xs">
                {language === "bn" ? "নিখুঁত ইসলামিক সময়সূচী" : "Verified Times"}
              </span>
            </div>

          </div>

          {/* Prayer Times Grid Cards */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <span>
                  {language === "bn"
                    ? `${selectedDistrictName} জেলা ও ${selectedThanaName || "সকল"} এলাকার সময়সূচী`
                    : `Schedule for ${selectedDistrictName}, ${selectedThanaName}`}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {calculatedPrayerSchedule.map((item) => {
                const isNext = nextPrayer.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition ${
                      isNext
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/50"
                        : "bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      {isNext && (
                        <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                          {language === "bn" ? "পরবর্তী" : "NEXT"}
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-sm mt-2">
                      {language === "en" ? item.nameEn : item.nameBn}
                    </h4>

                    <p className="font-black text-lg mt-0.5 tracking-tight">
                      {item.time}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. Interactive Live Sunrise Visual & Elevation Graphic (সজীব সূর্যোদয় ও দিগন্ত লেভেল) */}
      {activeTab === "sunrise" && (
        <div className="space-y-4">
          
          {/* Main Visual Sunrise Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-pulse">🌅</span>
                  <h3 className="font-black text-lg text-slate-900">
                    {language === "bn" ? "সজীব সূর্যোদয় ও দিগন্ত সূর্য লেভেল ট্র্যাকার" : "Live Sunrise Horizon Elevation Tracker"}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {language === "bn"
                    ? `${selectedDistrictName} এলাকায় সূর্যোদয়ের সময় দিগন্ত থেকে ঠিক যতটুকু সূর্য উঠছে, এখানে ততটুকুই দৃশ্যমান থাকবে!`
                    : `Visually displays the exact proportion of the sun that has risen above the horizon line in real-time.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulatingTime(!isSimulatingTime)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition ${
                    isSimulatingTime
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isSimulatingTime ? "সিমুলেশন মোড অন" : "লাইভ ঘড়ি মোড"}</span>
                </button>
              </div>
            </div>

            {/* Current Status Box */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-black/20 px-2.5 py-0.5 rounded-full">
                  {language === "bn" ? "বর্তমান সময় ও সূর্য উদয় অবস্থা" : "Current Sun Status"} — {formatTimeFromMinutes(activeMinutes)}
                </span>
                <h4 className="text-base sm:text-lg font-black">
                  {sunStatusTitleBn}
                </h4>
                <p className="text-xs text-amber-100 font-medium">
                  {sunStatusDescBn}
                </p>
              </div>

              {/* Sun Elevation Percentage Pill */}
              <div className="bg-white text-slate-900 p-3 rounded-2xl text-center shrink-0 shadow-md border border-amber-200 min-w-32">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 block">
                  {language === "bn" ? "উদয় শতাংশ" : "Risen Ratio"}
                </span>
                <span className="text-2xl font-black text-amber-600 tracking-tight">
                  {sunRisePercentage}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 block">
                  {sunRisePercentage === 100 ? "পূর্ণ উদয়" : sunRisePercentage === 0 ? "দিগন্তের নিচে" : "দিগন্তের উপরে"}
                </span>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* SVG Interactive Landscape Horizon Canvas                          */}
            {/* ----------------------------------------------------------------- */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-inner border border-amber-200 bg-slate-900">
              
              {/* SVG Canvas */}
              <svg
                viewBox="0 0 360 180"
                className="w-full h-auto max-h-72 object-cover block"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Sky Dynamic Gradient */}
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    {sunRisePercentage === 0 && (
                      <>
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </>
                    )}
                    {sunRisePercentage > 0 && sunRisePercentage < 50 && (
                      <>
                        <stop offset="0%" stopColor="#311b92" />
                        <stop offset="50%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </>
                    )}
                    {sunRisePercentage >= 50 && sunRisePercentage < 100 && (
                      <>
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="40%" stopColor="#ea580c" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </>
                    )}
                    {sunRisePercentage === 100 && (
                      <>
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="70%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#fef08a" />
                      </>
                    )}
                  </linearGradient>

                  {/* Glowing Sun Radial Gradient */}
                  <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#fef08a" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </radialGradient>

                  {/* Sub-Horizon Ground Clip Path */}
                  <clipPath id="aboveHorizonClip">
                    <rect x="0" y="0" width="360" height="110" />
                  </clipPath>

                  {/* Sub-Surface Underground Clip Path */}
                  <clipPath id="belowHorizonClip">
                    <rect x="0" y="110" width="360" height="70" />
                  </clipPath>
                </defs>

                {/* Sky Background */}
                <rect x="0" y="0" width="360" height="180" fill="url(#skyGrad)" />

                {/* Solar Aura Glow behind Sun */}
                <circle
                  cx="180"
                  cy={sunCenterY}
                  r={sunRadius + 15}
                  fill="#f59e0b"
                  opacity={sunRisePercentage > 0 ? 0.35 : 0}
                  className="transition-all duration-300"
                />

                {/* 1. SUB-HORIZON SUN (Part of Sun below horizon - dim opacity) */}
                <g clipPath="url(#belowHorizonClip)">
                  <circle
                    cx="180"
                    cy={sunCenterY}
                    r={sunRadius}
                    fill="url(#sunGrad)"
                    opacity="0.25"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </g>

                {/* 2. ABOVE-HORIZON SUN (The exact portion of the Sun risen above horizon!) */}
                <g clipPath="url(#aboveHorizonClip)">
                  <circle
                    cx="180"
                    cy={sunCenterY}
                    r={sunRadius}
                    fill="url(#sunGrad)"
                    className="transition-all duration-300"
                  />
                  {/* Rays around Sun */}
                  {sunRisePercentage > 20 && (
                    <g opacity={sunRisePercentage / 100} stroke="#fef08a" strokeWidth="2" strokeLinecap="round">
                      <line x1="180" y1={sunCenterY - 44} x2="180" y2={sunCenterY - 52} />
                      <line x1="180" y1={sunCenterY + 44} x2="180" y2={sunCenterY + 52} />
                      <line x1="136" y1={sunCenterY} x2="128" y2={sunCenterY} />
                      <line x1="224" y1={sunCenterY} x2="232" y2={sunCenterY} />
                      <line x1="149" y1={sunCenterY - 31} x2="143" y2={sunCenterY - 37} />
                      <line x1="211" y1={sunCenterY - 31} x2="217" y2={sunCenterY - 37} />
                    </g>
                  )}
                </g>

                {/* Horizon Line (দিগন্ত রেখা) */}
                <line
                  x1="0"
                  y1={horizonY}
                  x2="360"
                  y2={horizonY}
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />

                {/* Horizon Label Text */}
                <rect x="12" y="98" width="105" height="18" rx="4" fill="#0f172a" opacity="0.85" />
                <text x="16" y="111" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  🌅 দিগন্ত রেখা (Horizon)
                </text>

                {/* Dynamic Height Marker Line next to Sun */}
                {sunRisePercentage > 0 && sunRisePercentage < 100 && (
                  <g>
                    <line x1="228" y1={horizonY} x2="228" y2={sunCenterY - sunRadius} stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
                    <rect x="232" y={sunCenterY - 10} width="115" height="22" rx="6" fill="#000000" opacity="0.8" />
                    <text x="238" y={sunCenterY + 4} fill="#ffffff" fontSize="10" fontWeight="bold">
                      ▲ দৃশ্যমান: {sunRisePercentage}%
                    </text>
                  </g>
                )}

                {/* Ground Hills & Landscape Silhouette */}
                <path
                  d="M0,110 Q90,102 180,110 T360,110 L360,180 L0,180 Z"
                  fill="#064e3b"
                  opacity="0.95"
                />
                <path
                  d="M0,122 Q120,115 240,125 T360,120 L360,180 L0,180 Z"
                  fill="#022c22"
                />

                {/* Mosque Silhouette on Horizon */}
                <g fill="#022c22" opacity="0.9">
                  <path d="M 170 110 L 170 95 Q 180 85 190 95 L 190 110 Z" />
                  <line x1="180" y1="85" x2="180" y2="80" stroke="#022c22" strokeWidth="2" />
                  <circle cx="180" cy="79" r="1.5" fill="#fbbf24" />
                  <rect x="158" y="92" width="5" height="18" />
                  <rect x="197" y="92" width="5" height="18" />
                </g>
              </svg>

              {/* Graphic Footnote Overlay */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-bold text-emerald-100 bg-black/40 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                <span>📍 {selectedDistrictName} জেলা দিগন্ত সিমুলেশন</span>
                <span className="text-amber-300">
                  {sunRisePercentage === 100
                    ? "✨ সূর্য সম্পূর্ণ উদিত (১০০%)"
                    : sunRisePercentage === 0
                    ? "🌙 সূর্য দিগন্তের নিচে (০%)"
                    : `⚡ দিগন্ত থেকে উদয়: ${sunRisePercentage}%`}
                </span>
              </div>

            </div>

            {/* ----------------------------------------------------------------- */}
            {/* Interactive Sunrise Controls & Preset Slider                      */}
            {/* ----------------------------------------------------------------- */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-black text-slate-900">
                    {language === "bn" ? "সময় স্লাইডার ও সূর্য উদয় সিমুলেটর (Live Slider)" : "Time Slider & Sunrise Simulator"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlayingSunrise(!isAutoPlayingSunrise)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                      isAutoPlayingSunrise
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-amber-700 hover:bg-amber-800 text-white shadow-xs"
                    }`}
                  >
                    {isAutoPlayingSunrise ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoPlayingSunrise ? "অ্যানিমেশন থামান" : "সূর্যোদয় অ্যানিমেশন দেখুন (▶️)"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsSimulatingTime(false);
                      setIsAutoPlayingSunrise(false);
                    }}
                    className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-700 transition"
                    title="লাইভ ঘড়িতে ফেরত যান"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Time Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <span>ফজর শেষ (৫:১০ AM)</span>
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-black text-sm">
                    ⏰ নির্বাচন সময়: {formatTimeFromMinutes(activeMinutes)}
                  </span>
                  <span>সূর্য উদয় সম্পন্ন (৬:১০ AM)</span>
                </div>

                <input
                  type="range"
                  min={sunriseStartMin - 15}
                  max={sunriseEndMin + 25}
                  value={activeMinutes}
                  onChange={(e) => {
                    setIsSimulatingTime(true);
                    setIsAutoPlayingSunrise(false);
                    setSimulatedMinutes(Number(e.target.value));
                  }}
                  className="w-full accent-amber-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                
                <button
                  onClick={() => {
                    setIsSimulatingTime(true);
                    setIsAutoPlayingSunrise(false);
                    setSimulatedMinutes(sunriseStartMin);
                  }}
                  className="bg-white hover:bg-amber-50 border border-slate-200 p-2 rounded-2xl text-[11px] font-black text-slate-800 transition active:scale-95 text-center"
                >
                  🌅 ০% (উদয় শুরু)
                  <span className="block text-[10px] text-slate-500 font-semibold">{formatTimeFromMinutes(sunriseStartMin)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSimulatingTime(true);
                    setIsAutoPlayingSunrise(false);
                    setSimulatedMinutes(sunriseStartMin + 10);
                  }}
                  className="bg-white hover:bg-amber-50 border border-slate-200 p-2 rounded-2xl text-[11px] font-black text-slate-800 transition active:scale-95 text-center"
                >
                  🌗 ৫০% (অর্ধ-সূর্য)
                  <span className="block text-[10px] text-slate-500 font-semibold">{formatTimeFromMinutes(sunriseStartMin + 10)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSimulatingTime(true);
                    setIsAutoPlayingSunrise(false);
                    setSimulatedMinutes(sunriseEndMin);
                  }}
                  className="bg-white hover:bg-amber-50 border border-slate-200 p-2 rounded-2xl text-[11px] font-black text-slate-800 transition active:scale-95 text-center"
                >
                  ☀️ ১০০% (পূর্ণ উদয়)
                  <span className="block text-[10px] text-slate-500 font-semibold">{formatTimeFromMinutes(sunriseEndMin)}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSimulatingTime(false);
                    setIsAutoPlayingSunrise(false);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 p-2 rounded-2xl text-[11px] font-black text-emerald-900 transition active:scale-95 text-center"
                >
                  🔴 লাইভ ডিভাইস ঘড়ি
                  <span className="block text-[10px] text-emerald-700 font-semibold">{formatTimeFromMinutes(currentMinutesFromMidnight)}</span>
                </button>

              </div>

            </div>

            {/* Islamic Masla / Rulings for Sunrise */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <h4 className="font-extrabold text-sm sm:text-base">
                  {language === "bn" ? "সূর্যোদয় সম্পর্কিত শরীয়তের হুকুম (ইসলামিক নির্দেশনা)" : "Islamic Rulings Regarding Sunrise"}
                </h4>
              </div>

              <div className="text-xs text-slate-800 space-y-1.5 font-medium leading-relaxed">
                <p className="bg-white/80 p-2.5 rounded-2xl border border-amber-200/80">
                  🔴 <strong>মাকরূহ সময় (নামায নিষিদ্ধ):</strong> সূর্য দিগন্ত থেকে উঠা শুরু হওয়া (০%) থেকে শুরু করে সম্পূর্ণ বৃত্তাকার সূর্য উপরে ওঠা সম্পন্ন হওয়া (১০০%) পর্যন্ত যেকোনো সালাত বা নামায আদায় করা নিষিদ্ধ/মাকরূহ।
                </p>
                <p className="bg-white/80 p-2.5 rounded-2xl border border-amber-200/80">
                  🟢 <strong>ইশরাক ও চাশতের সময়:</strong> সূর্য ১০০% উদিত হওয়ার পর আনুমানিক ১০-১৫ মিনিট অতিবাহিত হলে (সূর্য এক বর্ষা পরিমাণ উঁচুতে উঠলে) ইশরাকের নামায পড়া সুন্নাত।
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. Interactive Qibla Compass */}
      {activeTab === "qibla" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center justify-center gap-2">
            <Compass className="w-5 h-5 text-emerald-700" />
            <span>{language === "bn" ? "কিবলা কম্পাস (Qibla Compass)" : "Qibla Direction Compass"}</span>
          </h3>

          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {language === "bn"
              ? `${selectedDistrictName} জেলা থেকে মক্কা শরীফের সঠিক দিকনির্দেশনা (২৪০° দক্ষিণ-পশ্চিম)`
              : `Accurate bearing towards Kaaba Sharif from ${selectedDistrictName} (240° SW)`}
          </p>

          <div className="relative w-56 h-56 mx-auto my-6 bg-slate-900 rounded-full border-4 border-emerald-500 shadow-2xl flex items-center justify-center p-4">
            
            {/* Compass Dial Outer Markings */}
            <span className="absolute top-2 text-white font-black text-xs">N</span>
            <span className="absolute right-3 text-white font-black text-xs">E</span>
            <span className="absolute bottom-2 text-white font-black text-xs">S</span>
            <span className="absolute left-3 text-white font-black text-xs">W</span>

            {/* Rotated Qibla Pointer */}
            <motion.div
              animate={{ rotate: compassAngle }}
              transition={{ type: "spring", stiffness: 60 }}
              className="w-full h-full flex items-center justify-center relative"
            >
              <div className="w-1.5 h-24 bg-gradient-to-t from-transparent to-amber-400 rounded-full shadow-md"></div>
              <div className="absolute top-3 text-2xl animate-pulse">
                🕋
              </div>
            </motion.div>

            {/* Center Pin */}
            <div className="absolute w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></div>
          </div>

          <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold px-4 py-2 rounded-2xl">
            📍 {language === "bn" ? "কিবলার দিক: ২৪০° (দক্ষিণ-পশ্চিম)" : "Qibla Angle: 240° (South-West)"}
          </div>
        </div>
      )}

      {/* 4. Mosque Finder */}
      {activeTab === "mosques" && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>🕌</span>
              <span>{t("nearestMosque")}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {mosques.length} {language === "bn" ? "টি মসজিদ পাওয়া গেছে" : "Mosques Nearby"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mosques.map((mosque) => (
              <div
                key={mosque.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={mosque.photo}
                      alt={mosque.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {mosque.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        📍 {mosque.address}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                        দূরত্ব: {mosque.distanceMeters} মিটার
                      </span>
                    </div>
                  </div>

                  {/* Jamat Times Table */}
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-[11px] font-bold text-slate-800 grid grid-cols-3 gap-1 text-center">
                    <div>ফজর: {mosque.jamatTimes.fajr}</div>
                    <div>যোহর: {mosque.jamatTimes.dhuhr}</div>
                    <div>আসর: {mosque.jamatTimes.asr}</div>
                    <div>মাগরিব: {mosque.jamatTimes.maghrib}</div>
                    <div>এশা: {mosque.jamatTimes.isha}</div>
                    <div>জুমুআ: {mosque.jamatTimes.jummah || "১:৩০ PM"}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`${mosque.name}-এ যাওয়ার দিকনির্দেশনা ম্যাপে লোড হচ্ছে...`);
                  }}
                  className="mt-3 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t("getDirections")}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Daily Hadith & Dua */}
      {activeTab === "hadith" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <BookOpen className="w-6 h-6" />
            <h3 className="font-extrabold text-base">{dailyHadith.title}</h3>
          </div>

          <blockquote className="text-sm font-medium text-slate-800 bg-emerald-50/80 p-5 rounded-2xl border-l-4 border-emerald-600 leading-relaxed italic">
            "{dailyHadith.text}"
          </blockquote>

          <p className="text-xs font-bold text-slate-500 text-right">
            — {dailyHadith.source}
          </p>
        </div>
      )}

    </div>
  );
};
