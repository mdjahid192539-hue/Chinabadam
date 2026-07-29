import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useApp } from "../context/AppContext";
import { ShieldCheck, UserPlus, MessageCircle, MapPin, Navigation, Info, Compass, Layers, Filter, Search, X, Sparkles, LocateFixed } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NearbyUser, GlobalUser, Mosque, TourismSpot, SportsGame } from "../types";

interface LocationPreset {
  name: string;
  nameEn: string;
  type: "thana" | "district" | "city" | "landmark";
  lat: number;
  lng: number;
  description: string;
}

const bdLocationsDatabase: LocationPreset[] = [
  {
    name: "গাজীপুর সদর থানা",
    nameEn: "Gazipur Sadar Thana",
    type: "thana",
    lat: 23.9999,
    lng: 90.4203,
    description: "গাজীপুর জেলা, ঢাকা বিভাগ",
  },
  {
    name: "গাজীপুর চৌরাস্তা",
    nameEn: "Gazipur Chowrasta",
    type: "landmark",
    lat: 23.9892,
    lng: 90.3789,
    description: "গাজীপুর হাইওয়ে জংশন",
  },
  {
    name: "বরিশাল জেলা শহর",
    nameEn: "Barishal District City",
    type: "district",
    lat: 22.7010,
    lng: 90.3535,
    description: "বরিশাল বিভাগীয় সদর",
  },
  {
    name: "বরিশাল কোতোয়ালি থানা",
    nameEn: "Barishal Kotwali Thana",
    type: "thana",
    lat: 22.7050,
    lng: 90.3600,
    description: "বরিশাল সিটি কর্পোরেশন",
  },
  {
    name: "ধানমন্ডি থানা, ঢাকা",
    nameEn: "Dhanmondi Thana, Dhaka",
    type: "thana",
    lat: 23.7465,
    lng: 90.3760,
    description: "ধানমন্ডি আবাসিক এলাকা, ঢাকা",
  },
  {
    name: "গুলশান থানা, ঢাকা",
    nameEn: "Gulshan Thana, Dhaka",
    type: "thana",
    lat: 23.7925,
    lng: 90.4078,
    description: "গুলশান মডেল টাউন, ঢাকা",
  },
  {
    name: "মিরপুর মডেল থানা, ঢাকা",
    nameEn: "Mirpur Model Thana, Dhaka",
    type: "thana",
    lat: 23.8069,
    lng: 90.3687,
    description: "মিরপুর ১০ গোলচত্বর এলাকা",
  },
  {
    name: "উত্তরা থানা, ঢাকা",
    nameEn: "Uttara Thana, Dhaka",
    type: "thana",
    lat: 23.8759,
    lng: 90.3795,
    description: "উত্তরা মডেল টাউন, ঢাকা",
  },
  {
    name: "চট্টগ্রাম সদর ও কোতোয়ালি",
    nameEn: "Chittagong Sadar & Kotwali",
    type: "district",
    lat: 22.3569,
    lng: 91.7832,
    description: "বন্দর নগরী চট্টগ্রাম",
  },
  {
    name: "সিলেট কোতোয়ালি থানা",
    nameEn: "Sylhet Kotwali Thana",
    type: "thana",
    lat: 24.8949,
    lng: 91.8687,
    description: "সিলেট শাহজালাল দরগাহ এলাকা",
  },
  {
    name: "খুলনা সদর থানা",
    nameEn: "Khulna Sadar Thana",
    type: "thana",
    lat: 22.8456,
    lng: 89.5403,
    description: "খুলনা বিভাগীয় সদর",
  },
  {
    name: "রাজশাহী বোয়ালিয়া থানা",
    nameEn: "Rajshahi Boalia Thana",
    type: "thana",
    lat: 24.3636,
    lng: 88.6241,
    description: "রাজশাহী পদ্মা পাড় এলাকা",
  },
  {
    name: "কক্সবাজার সদর থানা",
    nameEn: "Cox's Bazar Sadar Thana",
    type: "thana",
    lat: 21.4272,
    lng: 91.9702,
    description: "সমুদ্র সৈকত নগরী কক্সবাজার",
  },
  {
    name: "রংপুর কোতোয়ালি থানা",
    nameEn: "Rangpur Kotwali Thana",
    type: "thana",
    lat: 25.7439,
    lng: 89.2752,
    description: "রংপুর বিভাগীয় সদর",
  },
  {
    name: "ময়মনসিংহ কোতোয়ালি থানা",
    nameEn: "Mymensingh Kotwali Thana",
    type: "thana",
    lat: 24.7471,
    lng: 90.4203,
    description: "ময়মনসিংহ বিভাগীয় সদর",
  },
  {
    name: "কুমিল্লা সদর থানা",
    nameEn: "Comilla Sadar Thana",
    type: "thana",
    lat: 23.4607,
    lng: 91.1809,
    description: "কুমিল্লা কান্দিরপাড় এলাকা",
  },
  {
    name: "নোয়াখালী সুধারাম থানা",
    nameEn: "Noakhali Sudharam Thana",
    type: "thana",
    lat: 22.8696,
    lng: 91.0993,
    description: "মাইজদী কোর্ট, নোয়াখালী",
  },
  {
    name: "বগুড়া সদর থানা",
    nameEn: "Bogra Sadar Thana",
    type: "thana",
    lat: 24.8481,
    lng: 89.3730,
    description: "বগুড়া সাতমাথা এলাকা",
  },
];

export const LiveMap: React.FC = () => {
  const {
    selectedMapTab,
    setSelectedMapTab,
    mapFilter,
    setMapFilter,
    nearbyUsers,
    globalUsers,
    mosques,
    tourismSpots,
    sportsGames,
    t,
    language,
    sendFriendRequest,
    startChatWithUser,
    setActiveTab,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  const [selectedEntity, setSelectedEntity] = useState<{
    type: "user" | "mosque" | "tourism" | "sports" | "searched";
    data: any;
  } | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<LocationPreset[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [searchedLocationName, setSearchedLocationName] = useState<string | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Dhanmondi, Dhaka (23.7465, 90.3760)
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([23.7465, 90.3760], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }
  }, []);

  // Update search suggestions when user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches = bdLocationsDatabase.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.nameEn.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
    );

    setSearchResults(matches);
    setShowSearchDropdown(true);
  }, [searchQuery]);

  // Execute location search (Local DB + Nominatim API fallback)
  const handleSelectLocation = async (loc: { name: string; lat: number; lng: number; description?: string }) => {
    setShowSearchDropdown(false);
    setSearchQuery(loc.name);
    setSearchedLocationName(loc.name);

    const map = mapInstanceRef.current;
    if (!map) return;

    // Fly to position smoothly
    map.flyTo([loc.lat, loc.lng], 15, { duration: 1.8 });

    // Remove old search marker
    if (searchMarkerRef.current) {
      map.removeLayer(searchMarkerRef.current);
    }

    // Create search pin marker
    const searchIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative group cursor-pointer animate-bounce">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 border-2 border-white text-white shadow-2xl flex flex-col items-center justify-center text-lg">
            📍
          </div>
          <span class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-amber-300 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg border border-amber-500/40">
            ${loc.name}
          </span>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    const marker = L.marker([loc.lat, loc.lng], { icon: searchIcon }).addTo(map);
    searchMarkerRef.current = marker;

    setSelectedEntity({
      type: "searched",
      data: {
        name: loc.name,
        description: loc.description || "অনুসন্ধানকৃত নির্দিষ্ট স্থান",
        lat: loc.lat,
        lng: loc.lng,
      },
    });
  };

  // On submit form search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Check if matching in local preset db
    const q = searchQuery.toLowerCase().trim();
    const localMatch = bdLocationsDatabase.find(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.nameEn.toLowerCase().includes(q)
    );

    if (localMatch) {
      handleSelectLocation(localMatch);
      setIsSearching(false);
      return;
    }

    // If not in static list, query OpenStreetMap Nominatim
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + " Bangladesh"
        )}&countrycodes=bd`
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const top = data[0];
        handleSelectLocation({
          name: top.display_name.split(",")[0] || searchQuery,
          lat: parseFloat(top.lat),
          lng: parseFloat(top.lon),
          description: top.display_name,
        });
      } else {
        // Fallback to Gazipur or Barishal if query contains keyword
        if (q.includes("গাজীপুর") || q.includes("gazipur")) {
          handleSelectLocation(bdLocationsDatabase[0]);
        } else if (q.includes("বরিশাল") || q.includes("barishal") || q.includes("barisal")) {
          handleSelectLocation(bdLocationsDatabase[2]);
        } else {
          alert(language === "bn" ? `"${searchQuery}" স্থানটি খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক বানান লিখুন।` : `Location "${searchQuery}" not found.`);
        }
      }
    } catch (err) {
      // Fallback
      if (q.includes("গাজীপুর") || q.includes("gazipur")) {
        handleSelectLocation(bdLocationsDatabase[0]);
      } else if (q.includes("বরিশাল") || q.includes("barishal")) {
        handleSelectLocation(bdLocationsDatabase[2]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Update map view & markers whenever tab, filters, or entity list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (selectedMapTab === "nearby") {
      map.setView([23.7465, 90.3760], 14);

      // Render Nearby Users
      if (mapFilter === "all" || mapFilter === "users") {
        nearbyUsers.forEach((user) => {
          const userIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div class="relative group cursor-pointer">
                <div class="w-10 h-10 rounded-full border-2 border-blue-600 bg-white shadow-lg overflow-hidden flex items-center justify-center transform transition hover:scale-110">
                  <img src="${user.avatar}" class="w-full h-full object-cover" />
                </div>
                <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const marker = L.marker([user.latitude, user.longitude], { icon: userIcon });
          marker.on("click", () => {
            setSelectedEntity({ type: "user", data: user });
          });
          marker.addTo(markersGroup);
        });
      }

      // Render Mosques
      if (mapFilter === "all" || mapFilter === "mosques") {
        mosques.forEach((mosque) => {
          const mosqueIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div class="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-lg shadow-md cursor-pointer hover:scale-110 transition">
                🕌
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([mosque.latitude, mosque.longitude], { icon: mosqueIcon });
          marker.on("click", () => {
            setSelectedEntity({ type: "mosque", data: mosque });
          });
          marker.addTo(markersGroup);
        });
      }

      // Render Tourism Spots
      if (mapFilter === "all" || mapFilter === "tourism") {
        tourismSpots.forEach((spot) => {
          const spotIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div class="w-9 h-9 rounded-full bg-amber-500 border-2 border-white text-white flex items-center justify-center text-lg shadow-md cursor-pointer hover:scale-110 transition">
                🏞️
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([spot.latitude, spot.longitude], { icon: spotIcon });
          marker.on("click", () => {
            setSelectedEntity({ type: "tourism", data: spot });
          });
          marker.addTo(markersGroup);
        });
      }

      // Render Sports Grounds
      if (mapFilter === "all" || mapFilter === "sports") {
        sportsGames.forEach((game) => {
          const sportsIcon = L.divIcon({
            className: "custom-leaflet-marker",
            html: `
              <div class="w-9 h-9 rounded-full bg-indigo-600 border-2 border-white text-white flex items-center justify-center text-lg shadow-md cursor-pointer hover:scale-110 transition">
                ⚽
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([game.latitude, game.longitude], { icon: sportsIcon });
          marker.on("click", () => {
            setSelectedEntity({ type: "sports", data: game });
          });
          marker.addTo(markersGroup);
        });
      }

    } else {
      // Global View: Zoom out to show world cities
      map.setView([25.0, 55.0], 3);

      globalUsers.forEach((user) => {
        const globalIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-10 h-10 rounded-full border-2 border-amber-500 bg-white shadow-xl overflow-hidden flex items-center justify-center transform transition hover:scale-110">
                <img src="${user.avatar}" class="w-full h-full object-cover" />
              </div>
              <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([user.latitude, user.longitude], { icon: globalIcon });
        marker.on("click", () => {
          setSelectedEntity({ type: "user", data: user });
        });
        marker.addTo(markersGroup);
      });
    }
  }, [selectedMapTab, mapFilter, nearbyUsers, globalUsers, mosques, tourismSpots, sportsGames]);

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] min-h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col bg-slate-100">
      
      {/* Top Map Location Search Only */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        
        {/* Search Input Bar */}
        <div className="pointer-events-auto relative w-full max-w-xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-600 flex items-center gap-1">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchDropdown(true);
              }}
              placeholder="আপনার পরিচিত লোক জনকে খুঁজুন"
              className="w-full bg-white/95 backdrop-blur-md pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 border border-blue-200/80 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchDropdown(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1 disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "খুঁজুন" : "Search"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[1010] max-h-60 overflow-y-auto"
              >
                <div className="p-1.5 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 flex items-center justify-between">
                  <span>{language === "bn" ? "পরামর্শকৃত স্থানসমূহ" : "Suggested Locations"}</span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>

                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLocation(item)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50/80 transition flex items-center gap-2.5 border-b border-slate-50 last:border-0"
                  >
                    <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-sm">
                      {item.type === "thana" ? "🏢" : item.type === "district" ? "🏛️" : "📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.description} ({item.nameEn})
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {item.type === "thana" ? "থানা" : "জেলা"}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Selected Entity Popup Sheet */}
      {selectedEntity && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 max-w-md mx-auto"
        >
          {selectedEntity.type === "user" && (
            <div className="flex items-start gap-3">
              <img
                src={selectedEntity.data.avatar}
                alt={selectedEntity.data.realName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-base text-slate-900 truncate">
                    {selectedEntity.data.realName}
                  </h4>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Active Now"></span>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  📍 {selectedEntity.data.district || selectedEntity.data.city}, {selectedEntity.data.country}
                  {selectedEntity.data.distanceKm && ` (${selectedEntity.data.distanceKm} km)`}
                </p>

                <p className="text-xs text-slate-700 italic line-clamp-1 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  "{selectedEntity.data.bio}"
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => sendFriendRequest(selectedEntity.data.id)}
                    disabled={selectedEntity.data.requestPending}
                    className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {selectedEntity.data.requestPending
                        ? t("requestSent")
                        : t("friendRequest")}
                    </span>
                  </button>

                  <button
                    onClick={() => startChatWithUser(selectedEntity.data)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t("sendMessage")}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedEntity.type === "mosque" && (
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white text-2xl flex items-center justify-center shrink-0 shadow-md">
                🕌
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  {selectedEntity.data.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  📍 {selectedEntity.data.address} ({selectedEntity.data.distanceMeters}m)
                </p>
                <div className="mt-2 bg-emerald-50 p-2 rounded-xl border border-emerald-100 text-[11px] font-semibold text-emerald-900 flex justify-between">
                  <span>যোহর: {selectedEntity.data.jamatTimes.dhuhr}</span>
                  <span>আসর: {selectedEntity.data.jamatTimes.asr}</span>
                  <span>মাগরিব: {selectedEntity.data.jamatTimes.maghrib}</span>
                </div>
                <button
                  onClick={() => setActiveTab("islamic")}
                  className="w-full mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{language === "bn" ? "ইসলামিক কর্নারে বিস্তারিত দেখুন" : "View Prayer Details"}</span>
                </button>
              </div>
            </div>
          )}

          {selectedEntity.type === "tourism" && (
            <div className="flex items-start gap-3">
              <img
                src={selectedEntity.data.photo}
                alt={selectedEntity.data.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
              />
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  {selectedEntity.data.name}
                </h4>
                <p className="text-xs text-slate-600">
                  📍 {selectedEntity.data.address} • ⭐ {selectedEntity.data.rating}
                </p>
                <p className="text-xs text-slate-700 line-clamp-2 mt-1">
                  {selectedEntity.data.description}
                </p>
                <button
                  onClick={() => setActiveTab("tourism")}
                  className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-xl"
                >
                  {language === "bn" ? "দর্শনীয় স্থানে ছবি ও রিভিউ দেখুন" : "View Photos & Reviews"}
                </button>
              </div>
            </div>
          )}

          {selectedEntity.type === "sports" && (
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white text-2xl flex items-center justify-center shrink-0 shadow-md">
                ⚽
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  {selectedEntity.data.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  📍 {selectedEntity.data.venue} • ⏰ {selectedEntity.data.time}
                </p>
                <button
                  onClick={() => setActiveTab("sports")}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-xl"
                >
                  {t("joinMatch")}
                </button>
              </div>
            </div>
          )}

          {selectedEntity.type === "searched" && (
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white text-2xl flex items-center justify-center shrink-0 shadow-md animate-pulse">
                📍
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-base text-slate-900 truncate">
                    {selectedEntity.data.name}
                  </h4>
                  <span className="bg-red-100 text-red-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-red-200">
                    {language === "bn" ? "চিহ্নিত স্থান" : "Pin Location"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  📍 {selectedEntity.data.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const map = mapInstanceRef.current;
                      if (map) map.flyTo([selectedEntity.data.lat, selectedEntity.data.lng], 16);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <LocateFixed className="w-4 h-4" />
                    <span>{language === "bn" ? "কাছ থেকে দেখুন" : "Zoom In"}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://www.openstreetmap.org/#map=16/${selectedEntity.data.lat}/${selectedEntity.data.lng}`);
                      alert(language === "bn" ? "স্থানটির ম্যাপ লিঙ্ক কপি করা হয়েছে!" : "Map link copied!");
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{language === "bn" ? "লিঙ্ক কপি" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setSelectedEntity(null)}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 mt-2"
          >
            {language === "bn" ? "বন্ধ করুন" : "Close"}
          </button>
        </motion.div>
      )}

    </div>
  );
};
