import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  LocateFixed,
  Navigation,
  Clock,
  MapPin,
  Compass,
  Radio,
  Zap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sunrise,
  Sunset,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Play,
  Search,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  BANGLADESH_DIVISIONS,
  BASE_DHAKA_PRAYER_TIMES,
  formatTimeFromMinutes,
  District
} from "../data/bangladeshLocations";

interface CoordinateDistrictMapping {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  divisionId: string;
  districtBn: string;
  districtEn: string;
  offsetMinutes: number;
}

// Coordinate boundary ranges for major Bangladesh districts & highway routes
const DISTRICT_GEO_MAP: CoordinateDistrictMapping[] = [
  { latMin: 23.6, latMax: 24.1, lngMin: 90.2, lngMax: 90.6, divisionId: "dhaka", districtBn: "ঢাকা", districtEn: "Dhaka", offsetMinutes: 0 },
  { latMin: 23.8, latMax: 24.3, lngMin: 90.3, lngMax: 90.7, divisionId: "dhaka", districtBn: "গাজীপুর", districtEn: "Gazipur", offsetMinutes: 0 },
  { latMin: 23.4, latMax: 23.8, lngMin: 90.4, lngMax: 90.7, divisionId: "dhaka", districtBn: "নারায়ণগঞ্জ", districtEn: "Narayanganj", offsetMinutes: -1 },
  { latMin: 23.3, latMax: 23.7, lngMin: 90.8, lngMax: 91.3, divisionId: "chattogram", districtBn: "কুমিল্লা", districtEn: "Cumilla", offsetMinutes: -3 },
  { latMin: 22.9, latMax: 23.3, lngMin: 91.2, lngMax: 91.6, divisionId: "chattogram", districtBn: "ফেনী", districtEn: "Feni", offsetMinutes: -4 },
  { latMin: 22.0, latMax: 22.8, lngMin: 91.6, lngMax: 92.2, divisionId: "chattogram", districtBn: "চট্টগ্রাম", districtEn: "Chattogram", offsetMinutes: -5 },
  { latMin: 21.2, latMax: 21.9, lngMin: 91.8, lngMax: 92.4, divisionId: "chattogram", districtBn: "কক্সবাজার", districtEn: "Cox's Bazar", offsetMinutes: -6 },
  { latMin: 24.6, latMax: 25.1, lngMin: 91.6, lngMax: 92.2, divisionId: "sylhet", districtBn: "সিলেট", districtEn: "Sylhet", offsetMinutes: -6 },
  { latMin: 24.2, latMax: 24.6, lngMin: 91.6, lngMax: 92.0, divisionId: "sylhet", districtBn: "মৌলভীবাজার", districtEn: "Moulvibazar", offsetMinutes: -5 },
  { latMin: 24.2, latMax: 24.6, lngMin: 88.4, lngMax: 88.9, divisionId: "rajshahi", districtBn: "রাজশাহী", districtEn: "Rajshahi", offsetMinutes: 7 },
  { latMin: 24.6, latMax: 25.1, lngMin: 89.1, lngMax: 89.6, divisionId: "rajshahi", districtBn: "বগুড়া", districtEn: "Bogra", offsetMinutes: 4 },
  { latMin: 22.6, latMax: 23.0, lngMin: 89.3, lngMax: 89.8, divisionId: "khulna", districtBn: "খুলনা", districtEn: "Khulna", offsetMinutes: 5 },
  { latMin: 22.5, latMax: 23.0, lngMin: 90.1, lngMax: 90.6, divisionId: "barishal", districtBn: "বরিশাল", districtEn: "Barishal", offsetMinutes: 2 },
  { latMin: 25.6, latMax: 26.0, lngMin: 89.0, lngMax: 89.5, divisionId: "rangpur", districtBn: "রংপুর", districtEn: "Rangpur", offsetMinutes: 4 },
  { latMin: 24.6, latMax: 25.0, lngMin: 90.2, lngMax: 90.6, divisionId: "mymensingh", districtBn: "ময়মনসিংহ", districtEn: "Mymensingh", offsetMinutes: -1 },
];

export const GpsJourneyPrayerTracker: React.FC = () => {
  const { language } = useApp();

  // GPS Tracking Enabled State
  const [isGpsActive, setIsGpsActive] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);

  // Satellite Telemetry Data
  const [lat, setLat] = useState<number>(23.8103);
  const [lng, setLng] = useState<number>(90.4125);
  const [accuracy, setAccuracy] = useState<number>(12); // meters
  const [speed, setSpeed] = useState<number>(38); // km/h
  const [altitude, setAltitude] = useState<number>(18); // meters
  const [satelliteCount, setSatelliteCount] = useState<number>(11);

  // Matched District & Prayer Info
  const [detectedDistrictBn, setDetectedDistrictBn] = useState<string>("ঢাকা");
  const [detectedDistrictEn, setDetectedDistrictEn] = useState<string>("Dhaka");
  const [detectedDivisionId, setDetectedDivisionId] = useState<string>("dhaka");
  const [districtOffset, setDistrictOffset] = useState<number>(0);

  // Ticking Seconds Timer State
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Simulation Route presets for Testing Journey Experience
  const SIMULATION_STOPS = [
    { nameBn: "ঢাকা (যাত্রা শুরু)", nameEn: "Dhaka (Start)", lat: 23.8103, lng: 90.4125, distBn: "ঢাকা", offset: 0 },
    { nameBn: "কুমিল্লা হাইওয়ে (দাউদকান্দি)", nameEn: "Cumilla Highway", lat: 23.53, lng: 90.95, distBn: "কুমিল্লা", offset: -3 },
    { nameBn: "ফেনী ফ্লাইওভার", nameEn: "Feni Flyover", lat: 23.01, lng: 91.39, distBn: "ফেনী", offset: -4 },
    { nameBn: "চট্টগ্রাম শহর", nameEn: "Chattogram City", lat: 22.3569, lng: 91.7832, distBn: "চট্টগ্রাম", offset: -5 },
    { nameBn: "কক্সবাজার সমুদ্র সৈকত", nameEn: "Cox's Bazar Sea Beach", lat: 21.4272, lng: 92.0058, distBn: "কক্সবাজার", offset: -6 },
    { nameBn: "সিলেট শাহজালাল রোড", nameEn: "Sylhet Highway", lat: 24.8949, lng: 91.8687, distBn: "সিলেট", offset: -6 },
    { nameBn: "রাজশাহী বাইপাস", nameEn: "Rajshahi Bypass", lat: 24.3745, lng: 88.6042, distBn: "রাজশাহী", offset: +7 },
  ];
  const [simIndex, setSimIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [customStopSelected, setCustomStopSelected] = useState<boolean>(false);

  // Flatten all 64 districts & thanas into searchable list
  const ALL_SEARCHABLE_LOCATIONS = React.useMemo(() => {
    const list: Array<{
      nameBn: string;
      nameEn: string;
      divisionBn: string;
      divisionEn: string;
      distBn: string;
      offset: number;
      lat: number;
      lng: number;
    }> = [];

    // Add Dhaka Metro key urban hubs first for quick search match
    const METRO_AREAS = [
      { nameBn: "ধানমন্ডি (ঢাকা)", nameEn: "Dhanmondi (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "ধানমন্ডি, ঢাকা", offset: 0, lat: 23.7461, lng: 90.3742 },
      { nameBn: "মিরপুর (ঢাকা)", nameEn: "Mirpur (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "মিরপুর, ঢাকা", offset: 0, lat: 23.8223, lng: 90.3654 },
      { nameBn: "উত্তরা (ঢাকা)", nameEn: "Uttara (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "উত্তরা, ঢাকা", offset: 0, lat: 23.8759, lng: 90.3795 },
      { nameBn: "গুলশান (ঢাকা)", nameEn: "Gulshan (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "গুলশান, ঢাকা", offset: 0, lat: 23.7925, lng: 90.4078 },
      { nameBn: "মোহাম্মদপুর (ঢাকা)", nameEn: "Mohammadpur (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "মোহাম্মদপুর, ঢাকা", offset: 0, lat: 23.7658, lng: 90.3582 },
      { nameBn: "মতিঝিল (ঢাকা)", nameEn: "Motijheel (Dhaka)", divisionBn: "ঢাকা বিভাগ", divisionEn: "Dhaka Division", distBn: "মতিঝিল, ঢাকা", offset: 0, lat: 23.7330, lng: 90.4170 },
      { nameBn: "বরিশাল শহর (বরিশাল)", nameEn: "Barishal City", divisionBn: "বরিশাল বিভাগ", divisionEn: "Barishal Division", distBn: "বরিশাল", offset: 2, lat: 22.7010, lng: 90.3535 },
      { nameBn: "রংপুর শহর (রংপুর)", nameEn: "Rangpur City", divisionBn: "রংপুর বিভাগ", divisionEn: "Rangpur Division", distBn: "রংপুর", offset: 4, lat: 25.7439, lng: 89.2752 },
      { nameBn: "চট্টগ্রাম শহর (চট্টগ্রাম)", nameEn: "Chattogram City", divisionBn: "চট্টগ্রাম বিভাগ", divisionEn: "Chattogram Division", distBn: "চট্টগ্রাম", offset: -5, lat: 22.3569, lng: 91.7832 },
      { nameBn: "সিলেট শহর (সিলেট)", nameEn: "Sylhet City", divisionBn: "সিলেট বিভাগ", divisionEn: "Sylhet Division", distBn: "সিলেট", offset: -6, lat: 24.8949, lng: 91.8687 },
    ];

    METRO_AREAS.forEach((m) => list.push(m));

    // Add preset stops
    SIMULATION_STOPS.forEach((stop) => {
      list.push({
        nameBn: stop.nameBn,
        nameEn: stop.nameEn,
        divisionBn: "হাইওয়ে রুট",
        divisionEn: "Highway Route",
        distBn: stop.distBn,
        offset: stop.offset,
        lat: stop.lat,
        lng: stop.lng,
      });
    });

    // Add all districts from BANGLADESH_DIVISIONS
    BANGLADESH_DIVISIONS.forEach((div) => {
      div.districts.forEach((dist) => {
        if (!list.some((item) => item.distBn === dist.nameBn && item.divisionBn === div.nameBn)) {
          list.push({
            nameBn: `${dist.nameBn} জেলা`,
            nameEn: `${dist.nameEn} District`,
            divisionBn: div.nameBn,
            divisionEn: div.nameEn,
            distBn: dist.nameBn,
            offset: dist.offsetMinutes,
            lat: 23.81 - dist.offsetMinutes * 0.1,
            lng: 90.41 - dist.offsetMinutes * 0.25,
          });
        }

        // Add thanas
        dist.thanas.forEach((thana) => {
          list.push({
            nameBn: `${thana.nameBn} (${dist.nameBn})`,
            nameEn: `${thana.nameEn} (${dist.nameEn})`,
            divisionBn: div.nameBn,
            divisionEn: div.nameEn,
            distBn: dist.nameBn,
            offset: dist.offsetMinutes,
            lat: 23.81 - dist.offsetMinutes * 0.1,
            lng: 90.41 - dist.offsetMinutes * 0.25,
          });
        });
      });
    });

    return list;
  }, []);

  // Filtered stops based on search query
  const filteredStops = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALL_SEARCHABLE_LOCATIONS.filter(
      (item) =>
        item.nameBn.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.distBn.toLowerCase().includes(q) ||
        item.divisionBn.toLowerCase().includes(q)
    ).slice(0, 16);
  }, [searchQuery, ALL_SEARCHABLE_LOCATIONS]);

  // Handle selecting a custom stop from search
  const handleSelectCustomStop = (stop: {
    nameBn: string;
    nameEn: string;
    distBn: string;
    offset: number;
    lat: number;
    lng: number;
  }) => {
    setDetectedDistrictBn(stop.nameBn);
    setDetectedDistrictEn(stop.nameEn);
    setDistrictOffset(stop.offset);
    setLat(stop.lat);
    setLng(stop.lng);
    setAccuracy(5);
    setSpeed(48);
    setCustomStopSelected(true);
    setSearchQuery("");
  };

  // Live second-by-second ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Match District from Coordinates
  const matchDistrictFromCoords = (latitude: number, longitude: number) => {
    const matched = DISTRICT_GEO_MAP.find(
      (m) =>
        latitude >= m.latMin &&
        latitude <= m.latMax &&
        longitude >= m.lngMin &&
        longitude <= m.lngMax
    );

    if (matched) {
      setDetectedDistrictBn(matched.districtBn);
      setDetectedDistrictEn(matched.districtEn);
      setDetectedDivisionId(matched.divisionId);
      setDistrictOffset(matched.offsetMinutes);
    } else {
      // Default estimation by longitude relative to Dhaka (90.4125 E)
      // 1 degree longitude difference ~ 4 minutes solar time offset
      const lngDiff = longitude - 90.4125;
      const estimatedOffset = Math.round(-lngDiff * 4);
      setDistrictOffset(estimatedOffset);

      if (longitude > 91.5) {
        setDetectedDistrictBn("চট্টগ্রাম / সিলেট অঞ্চল");
        setDetectedDistrictEn("Chattogram / Sylhet Zone");
      } else if (longitude < 89.5) {
        setDetectedDistrictBn("রাজশাহী / খুলনা অঞ্চল");
        setDetectedDistrictEn("Rajshahi / Khulna Zone");
      } else {
        setDetectedDistrictBn("ঢাকা বিভাগ (হাইওয়ে)");
        setDetectedDistrictEn("Dhaka Highway Zone");
      }
    }
  };

  // Real GPS Geolocation Watcher
  useEffect(() => {
    let watchId: number | null = null;

    if (isGpsActive && "geolocation" in navigator) {
      setIsLocating(true);
      setGpsErrorMsg(null);

      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude, accuracy: acc, speed: spd, altitude: alt } = pos.coords;
          
          setLat(latitude);
          setLng(longitude);
          if (acc) setAccuracy(Math.round(acc));
          if (spd) setSpeed(Math.round(spd * 3.6)); // m/s to km/h
          if (alt) setAltitude(Math.round(alt));
          setSatelliteCount(Math.floor(8 + Math.random() * 6));

          matchDistrictFromCoords(latitude, longitude);
        },
        (err) => {
          setIsLocating(false);
          setGpsErrorMsg(
            language === "bn"
              ? "জিপিএস সিগন্যাল সংযোগ বিচ্ছিন্ন। স্থানীয় জেলা ট্র্যাকিং চালু আছে।"
              : "GPS Signal disconnected. Standard district timing active."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 2000,
        }
      );
    }

    return () => {
      if (watchId !== null && "geolocation" in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isGpsActive, language]);

  // Handle Simulation Fast Stop Change
  const handleSimulateJourneyStop = (index: number) => {
    setSimIndex(index);
    const stop = SIMULATION_STOPS[index];
    setLat(stop.lat);
    setLng(stop.lng);
    setDetectedDistrictBn(stop.distBn);
    setDetectedDistrictEn(stop.distBn);
    setDistrictOffset(stop.offset);
    setAccuracy(5);
    setSpeed(54);
    setCustomStopSelected(false);
  };

  // Calculate Prayer Schedule & Live Remaining Countdowns
  const currentTotalMins = nowTime.getHours() * 60 + nowTime.getMinutes();
  const currentSecs = nowTime.getSeconds();

  const adjustedPrayers = BASE_DHAKA_PRAYER_TIMES.map((prayer) => {
    const adjMins = prayer.baseMinutes + districtOffset;
    return {
      ...prayer,
      adjustedMinutes: adjMins,
      formattedTime: formatTimeFromMinutes(adjMins),
    };
  });

  // Determine current active prayer and upcoming prayer
  let currentActivePrayer = adjustedPrayers[0];
  let nextUpcomingPrayer = adjustedPrayers[0];

  for (let i = 0; i < adjustedPrayers.length; i++) {
    const p = adjustedPrayers[i];
    if (p.id === "jummah") continue;

    if (currentTotalMins >= p.adjustedMinutes) {
      currentActivePrayer = p;
    }
    if (p.adjustedMinutes > currentTotalMins) {
      nextUpcomingPrayer = p;
      break;
    }
  }

  // If after Isha, next is Fajr next day
  if (currentTotalMins >= adjustedPrayers[4].adjustedMinutes) {
    nextUpcomingPrayer = adjustedPrayers[0];
  }

  // Helper to calculate exact countdown object (hours, minutes, seconds)
  const getPrayerRemainingCountdown = (targetMinutes: number) => {
    let diffMins = targetMinutes - currentTotalMins;
    if (diffMins <= 0) {
      diffMins += 1440; // Add 24 hours
    }

    // Account for current seconds
    let remainingTotalSecs = diffMins * 60 - currentSecs;
    if (remainingTotalSecs < 0) remainingTotalSecs += 86400;

    const hrs = Math.floor(remainingTotalSecs / 3600);
    const mins = Math.floor((remainingTotalSecs % 3600) / 60);
    const secs = remainingTotalSecs % 60;

    return { hrs, mins, secs, totalSecs: remainingTotalSecs };
  };

  // Convert digits to Bengali string
  const toBnDigits = (num: number | string): string => {
    const bnNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => (bnNums[parseInt(d)] !== undefined ? bnNums[parseInt(d)] : d))
      .join("");
  };

  const formatCountdownStr = (hrs: number, mins: number, secs: number): string => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    if (language === "bn") {
      if (hrs > 0) {
        return `${toBnDigits(pad(hrs))} ঘণ্টা ${toBnDigits(pad(mins))} মি. ${toBnDigits(pad(secs))} সে. বাকি`;
      }
      return `${toBnDigits(pad(mins))} মিনিট ${toBnDigits(pad(secs))} সেকেন্ড বাকি`;
    } else {
      if (hrs > 0) {
        return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s remaining`;
      }
      return `${pad(mins)}m ${pad(secs)}s remaining`;
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5 relative overflow-hidden">
      
      {/* Background Decorative Radar Waves */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Main Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span className="absolute w-8 h-8 rounded-full bg-emerald-400/20 animate-ping pointer-events-none"></span>
            </div>
            <h3 className="font-black text-lg sm:text-xl tracking-wide text-white">
              {language === "bn"
                ? "🚀 আজকের যাত্রাপথে জিপিএস ও স্যাটেলাইট নামাজ ট্র্যাকার"
                : "GPS Journey & Satellite Prayer Tracker"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {language === "bn"
              ? "সফরে জিপিএস অন করলে স্যাটেলাইট ডেটা থেকে আপনার জেলা নির্ণয় করে প্রতিটি নামাজের অবশিষ্ট সেকেন্ড-বাই-সেকেন্ড সঠিক সময় হিসাব করে দেয়।"
              : "Calculates precise prayer countdowns for your moving district using real GPS satellite coordinates."}
          </p>
        </div>

        {/* Master GPS Toggle */}
        <button
          onClick={() => setIsGpsActive(!isGpsActive)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md transition active:scale-95 shrink-0 ${
            isGpsActive
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-400/30"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
          }`}
        >
          <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin text-amber-300" : "text-white"}`} />
          <span>
            {isGpsActive
              ? language === "bn"
                ? "📡 জিপিএস স্যাটেলাইট ট্র্যাকিং সক্রিয়"
                : "📡 GPS Active"
              : language === "bn"
              ? "⚪ জিপিএস অন করুন"
              : "Turn ON GPS"}
          </span>
        </button>
      </div>

      {/* Satellite Telemetry Ribbon */}
      {isGpsActive && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="font-extrabold text-slate-300">
              {language === "bn" ? "জিপিএস অবস্থান:" : "GPS Location:"}
            </span>
            <span className="font-mono text-emerald-300 font-bold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-700">
              {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-slate-300 flex-wrap">
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]">
              📡 {satelliteCount} {language === "bn" ? "টি স্যাটেলাইট লক" : "Satellites"}
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]">
              🎯 {language === "bn" ? `সুনির্দিষ্টতা ±${accuracy}মি.` : `Accuracy ±${accuracy}m`}
            </span>
            <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]">
              🏎️ {language === "bn" ? `গতি: ${speed} কি.মি./ঘণ্টা` : `Speed: ${speed} km/h`}
            </span>
          </div>
        </div>
      )}

      {/* Main Universal Location Searcher & District Switcher */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/50 space-y-3 z-10 relative shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-xs sm:text-sm">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === "bn"
                  ? "🔎 অন্য কোনো জেলা বা এলাকার সময় দেখতে চান? নাম দিয়ে খুঁজুন:"
                  : "🔎 Check Prayer Schedule for Any District or Metro Area:"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === "bn"
                ? "আপনি এক জায়গায় অবস্থান করলেও দেশের যেকোনো জেলা বা ধানমন্ডি, মিরপুর ইত্যাদির নামাজের সময় সার্চ করে দেখতে পারবেন।"
                : "Search & view prayer timings for Dhaka, Barishal, Rangpur, Sylhet, Dhanmondi or any upazila."}
            </p>
          </div>

          {customStopSelected && (
            <button
              onClick={() => {
                setCustomStopSelected(false);
                matchDistrictFromCoords(lat, lng);
              }}
              className="text-[11px] font-extrabold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-800 transition flex items-center gap-1 shrink-0 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === "bn" ? "জিপিএস অটো ডিটেক্টে ফিরুন" : "Reset to Auto GPS"}</span>
            </button>
          )}
        </div>

        {/* Live Search Input Box with Action Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "bn"
                  ? "🔍 জেলা বা স্থান লিখুন (যেমন: বরিশাল, ঢাকা, ধানমন্ডি, রংপুর, সিলেট, চট্টগ্রাম, বগুড়া...)"
                  : "🔍 Search area (e.g. Barishal, Dhaka, Dhanmondi, Rangpur, Sylhet, Chittagong...)"
              }
              className="w-full bg-slate-900 border border-amber-500/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!searchQuery.trim()) setSearchQuery("ঢাকা");
            }}
            className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0 transition active:scale-95 border border-amber-300"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{language === "bn" ? "খুঁজুন" : "Search"}</span>
          </button>
        </div>

        {/* Dedicated Search Action Button Above Location Chips */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              const el = document.querySelector('input[placeholder*="জেলা বা স্থান"]') as HTMLInputElement;
              if (el) el.focus();
            }}
            className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 text-amber-200 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>
              {language === "bn"
                ? "🔍 যেকোনো জেলা বা ধানমন্ডি এলাকার সময়সূচী সরাসরি সার্চ করুন"
                : "🔍 Search Timings for Any District or Area"}
            </span>
          </button>
        </div>

        {/* Search Results Dropdown List */}
        {searchQuery.trim() !== "" && (
          <div className="space-y-1.5 pt-1 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-bold text-slate-400 px-1 flex items-center justify-between">
              <span>
                {language === "bn"
                  ? `খোঁজা স্থানে ${filteredStops.length} টি এলাকা পাওয়া গেছে (ক্লিক করুন):`
                  : `Found ${filteredStops.length} matching locations (click to view):`}
              </span>
            </div>

            {filteredStops.length === 0 ? (
              <div className="p-3 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                {language === "bn"
                  ? "কোনো এলাকা বা জেলা পাওয়া যায়নি। অন্য বানান বা জেলার নাম দিয়ে চেষ্টা করুন।"
                  : "No district found matching your search. Try another spelling."}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {filteredStops.map((stop, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCustomStop(stop)}
                    className="p-2.5 bg-slate-950 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-400/60 rounded-xl text-left transition active:scale-95 group flex items-center justify-between gap-1.5"
                  >
                    <div className="truncate">
                      <span className="text-xs font-black text-slate-200 group-hover:text-amber-300 block truncate">
                        {language === "bn" ? stop.nameBn : stop.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {stop.divisionBn}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded-lg shrink-0">
                      {stop.offset >= 0 ? `+${stop.offset}` : stop.offset}ম
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Popular District Switcher Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">
            {language === "bn" ? "দ্রুত ক্লিক:" : "Quick Switch:"}
          </span>
          {[
            { nameBn: "ঢাকা (ধানমন্ডি)", nameEn: "Dhanmondi (Dhaka)", distBn: "ধানমন্ডি, ঢাকা", offset: 0, lat: 23.7461, lng: 90.3742 },
            { nameBn: "বরিশাল", nameEn: "Barishal", distBn: "বরিশাল", offset: 2, lat: 22.7010, lng: 90.3535 },
            { nameBn: "রংপুর", nameEn: "Rangpur", distBn: "রংপুর", offset: 4, lat: 25.7439, lng: 89.2752 },
            { nameBn: "চট্টগ্রাম", nameEn: "Chattogram", distBn: "চট্টগ্রাম", offset: -5, lat: 22.3569, lng: 91.7832 },
            { nameBn: "সিলেট", nameEn: "Sylhet", distBn: "সিলেট", offset: -6, lat: 24.8949, lng: 91.8687 },
            { nameBn: "রাজশাহী", nameEn: "Rajshahi", distBn: "রাজশাহী", offset: 7, lat: 24.3745, lng: 88.6042 },
            { nameBn: "খুলনা", nameEn: "Khulna", distBn: "খুলনা", offset: 5, lat: 22.8456, lng: 89.5403 },
            { nameBn: "বগুড়া", nameEn: "Bogra", distBn: "বগুড়া", offset: 4, lat: 24.8481, lng: 89.3730 },
            { nameBn: "কুমিল্লা", nameEn: "Cumilla", distBn: "কুমিল্লা", offset: -3, lat: 23.4607, lng: 91.1809 },
            { nameBn: "কক্সবাজার", nameEn: "Cox's Bazar", distBn: "কক্সবাজার", offset: -6, lat: 21.4272, lng: 92.0058 }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectCustomStop(chip)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition active:scale-95 shrink-0 flex items-center gap-1 ${
                detectedDistrictBn.includes(chip.distBn) || detectedDistrictBn.includes(chip.nameBn)
                  ? "bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-300/40"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>{language === "bn" ? chip.nameBn : chip.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detected Moving Location Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-black text-emerald-400 tracking-wider block">
              {language === "bn" ? "জিপিএস ডিটেক্ট করা বর্তমান জেলা ও হাইওয়ে:" : "Detected District & Route:"}
            </span>
            <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{detectedDistrictBn}</span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                {districtOffset >= 0 ? `+${districtOffset}` : districtOffset} {language === "bn" ? "মি. অফসেট" : "min offset"}
              </span>
            </h4>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {language === "bn"
                ? `ঢাকার স্ট্যান্ডার্ড সময়ের সাপেক্ষে ${districtOffset >= 0 ? `+${districtOffset}` : districtOffset} মিনিটের সময় পার্থক্য প্রয়োগ করা হয়েছে।`
                : `Applied ${districtOffset >= 0 ? `+${districtOffset}` : districtOffset} minutes solar offset relative to Dhaka.`}
            </p>
          </div>
        </div>

        {/* Qasr Traveler Shortcut Badge */}
        <div className="bg-amber-500/20 border border-amber-400/40 text-amber-200 px-3.5 py-2 rounded-2xl text-center shrink-0">
          <span className="text-[10px] font-black uppercase block tracking-wider text-amber-300">
            {language === "bn" ? "🕌 মুসাফির / সফর সুবিধা" : "🕌 Traveler Qasr"}
          </span>
          <span className="text-xs font-bold text-white">
            {language === "bn" ? "৪৮ কি.মি.+ সফরে কসর সুবিধা" : "48km+ Qasr Rules Apply"}
          </span>
        </div>
      </div>

      {/* Main Next Prayer Featured Countdown Box */}
      {nextUpcomingPrayer && (() => {
        const cd = getPrayerRemainingCountdown(nextUpcomingPrayer.adjustedMinutes);
        return (
          <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white p-5 rounded-3xl shadow-lg border border-amber-400/40 relative overflow-hidden z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <span className="text-4xl animate-bounce">{nextUpcomingPrayer.icon}</span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-100 bg-black/20 px-3 py-0.5 rounded-full">
                    {language === "bn" ? "পরবর্তী ওয়াক্তের সালাত" : "Next Prayer"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-1">
                    {language === "bn" ? nextUpcomingPrayer.nameBn : nextUpcomingPrayer.nameEn} — {nextUpcomingPrayer.formattedTime}
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    {language === "bn"
                      ? `${detectedDistrictBn} এলাকায় সময় অনুযায়ী বাকি সময় হিসাব করা হচ্ছে`
                      : `Live countdown calculated for ${detectedDistrictBn} location`}
                  </p>
                </div>
              </div>

              {/* Ticking Live Digital Countdown Box */}
              <div className="bg-slate-950/90 text-amber-400 border border-amber-400/40 px-5 py-3 rounded-2xl text-center shadow-2xl shrink-0 min-w-48">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 block mb-0.5">
                  ⏰ {language === "bn" ? "অবশিষ্ট সময় (লাইভ ঘড়ি)" : "Remaining Time"}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black tracking-tight text-amber-300">
                  {formatCountdownStr(cd.hrs, cd.mins, cd.secs)}
                </span>
              </div>

            </div>
          </div>
        );
      })()}

      {/* All 5 Daily Prayers Live Countdown Grid */}
      <div className="space-y-3 z-10 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h4 className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>
              {language === "bn"
                ? `${detectedDistrictBn} জেলার সকল ওয়াক্তের নামাজের অবশিষ্ট সময়সূচী`
                : `All Prayer Countdowns for ${detectedDistrictBn}`}
            </span>
          </h4>
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
            {language === "bn" ? "প্রতি সেকেন্ডে আপডেট" : "Live Ticking"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {adjustedPrayers
            .filter((p) => p.id !== "jummah")
            .map((item) => {
              const cd = getPrayerRemainingCountdown(item.adjustedMinutes);
              const isActive = currentActivePrayer.id === item.id;
              const isNext = nextUpcomingPrayer.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                    isNext
                      ? "bg-amber-500/20 border-amber-400/60 shadow-md ring-1 ring-amber-400/40"
                      : isActive
                      ? "bg-emerald-900/50 border-emerald-500/50 shadow-sm"
                      : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    {isNext ? (
                      <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                        {language === "bn" ? "পরবর্তী" : "NEXT"}
                      </span>
                    ) : isActive ? (
                      <span className="text-[9px] font-black bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full">
                        {language === "bn" ? "চলমান" : "ACTIVE"}
                      </span>
                    ) : null}
                  </div>

                  <h5 className="font-extrabold text-sm text-white mt-2">
                    {language === "bn" ? item.nameBn : item.nameEn}
                  </h5>

                  <p className="text-xs font-bold text-slate-300 mt-0.5">
                    {item.formattedTime}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-700/60">
                    <span className="text-[10px] text-amber-300 font-mono font-bold block">
                      ⏳ {formatCountdownStr(cd.hrs, cd.mins, cd.secs)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Travel Journey Simulation Quick Bar with Location Search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 z-10 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
            <Play className="w-4 h-4 text-amber-400" />
            <span>
              {language === "bn"
                ? "যাত্রাপথ টেস্ট সিমুলেশন (বিভিন্ন জেলায় গেলে সময় কীভাবে বদলায় দেখুন):"
                : "Journey Route Simulation (Test timing changes across districts):"}
            </span>
          </span>

          {/* Active Location Indicator */}
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-800/60 flex items-center gap-1 shrink-0">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {language === "bn"
                ? `স্থান: ${detectedDistrictBn}`
                : `Location: ${detectedDistrictBn}`}
            </span>
          </span>
        </div>

        {/* Search Input with Search Button for Selecting Destination / District */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "bn"
                  ? "🔍 আপনার যাত্রা পথের স্থান বা জেলা লিখে খুঁজুন (যেমন: কুমিল্লা, চট্টগ্রাম, সিলেট, বগুড়া, কক্সবাজার...)"
                  : "🔍 Search journey destination or district (e.g. Cumilla, Chattogram, Sylhet, Bogra...)"
              }
              className="w-full bg-slate-900 border border-slate-700/80 focus:border-amber-400 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition font-medium shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!searchQuery.trim()) setSearchQuery("কুমিল্লা");
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 transition active:scale-95"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{language === "bn" ? "খুঁজুন" : "Search"}</span>
          </button>
        </div>

        {/* Dedicated Search Action Button Above Preset Buttons */}
        <button
          type="button"
          onClick={() => {
            const inputs = document.querySelectorAll('input[placeholder*="যাত্রা পথের স্থান"]');
            if (inputs.length > 0) (inputs[0] as HTMLInputElement).focus();
          }}
          className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span>
            {language === "bn"
              ? "🔍 স্থান দিয়ে নতুন যাত্রাপথ সার্চ করুন"
              : "🔍 Search New Journey Location"}
          </span>
        </button>

        {/* Search Results / Filtered List */}
        {searchQuery.trim() !== "" ? (
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold text-slate-400 px-1 flex items-center justify-between">
              <span>
                {language === "bn"
                  ? `খোঁজা স্থানে ${filteredStops.length} টি মিল পাওয়া গেছে:`
                  : `Found ${filteredStops.length} matching locations:`}
              </span>
            </div>

            {filteredStops.length === 0 ? (
              <div className="p-3 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400">
                {language === "bn"
                  ? "কোনো জেলা বা স্থান পাওয়া যায়নি। অন্য বানান বা জেলার নাম দিয়ে চেষ্টা করুন।"
                  : "No district found matching your search. Try another spelling."}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                {filteredStops.map((stop, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCustomStop(stop)}
                    className="p-2 bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-400/60 rounded-xl text-left transition active:scale-95 group flex items-center justify-between gap-1.5"
                  >
                    <div className="truncate">
                      <span className="text-xs font-black text-slate-200 group-hover:text-amber-300 block truncate">
                        {language === "bn" ? stop.nameBn : stop.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {stop.divisionBn}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded-lg shrink-0">
                      {stop.offset >= 0 ? `+${stop.offset}` : stop.offset}ম
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Quick Highway & District Preset Buttons */
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Search Button in place of current location button */}
            <button
              type="button"
              onClick={() => {
                const inputs = document.querySelectorAll('input[placeholder*="যাত্রা পথের স্থান"]');
                if (inputs.length > 0) (inputs[0] as HTMLInputElement).focus();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition active:scale-95 shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm border border-amber-300"
            >
              <Search className="w-3.5 h-3.5 text-slate-950" />
              <span>{language === "bn" ? "🔍 স্থান খুঁজুন" : "🔍 Search Location"}</span>
            </button>

            {SIMULATION_STOPS.map((stop, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateJourneyStop(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 shrink-0 flex items-center gap-1.5 ${
                  simIndex === idx && !customStopSelected
                    ? "bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-300/40"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{language === "bn" ? stop.nameBn : stop.nameEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
