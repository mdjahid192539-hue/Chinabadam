import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  X,
  Crown,
  Shield,
  Globe,
  MessageSquare,
  Moon,
  Eye,
  Sliders,
  Type,
  Upload,
  Lock,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChinabadamLogo } from "./ChinabadamLogo";
import { LogoConfig } from "../types";

export const LogoCustomizerModal: React.FC = () => {
  const {
    logoConfig,
    updateLogoConfig,
    resetLogoConfig,
    isLogoModalOpen,
    setIsLogoModalOpen,
    language,
    currentUser
  } = useApp();

  // Local draft state for live previewing before saving
  const [draftConfig, setDraftConfig] = useState<LogoConfig>(logoConfig);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLogoModalOpen) {
      setDraftConfig(logoConfig);
      setCustomUrlInput(logoConfig.customImageUrl || "");
    }
  }, [isLogoModalOpen, logoConfig]);

  // Handle gallery image upload with automatic canvas compression & fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl !== "string") return;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const maxDim = 320;
          let width = img.width || maxDim;
          let height = img.height || maxDim;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/png");
            setDraftConfig((prev) => ({
              ...prev,
              iconType: "custom_image",
              customImageUrl: compressedDataUrl,
            }));
            return;
          }
        } catch (err) {
          console.error("Canvas compression fallback:", err);
        }

        // Fallback if canvas fails
        setDraftConfig((prev) => ({
          ...prev,
          iconType: "custom_image",
          customImageUrl: dataUrl,
        }));
      };

      img.onerror = () => {
        setDraftConfig((prev) => ({
          ...prev,
          iconType: "custom_image",
          customImageUrl: dataUrl,
        }));
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = () => {
    updateLogoConfig(draftConfig);
    setIsLogoModalOpen(false);
  };

  const handleReset = () => {
    resetLogoConfig();
    setIsLogoModalOpen(false);
  };

  // Preset Theme Gradients
  const themeGradients: { id: LogoConfig["themeGradient"]; nameBn: string; nameEn: string; colorPreview: string }[] = [
    { id: "emerald_gold", nameBn: "মরকত ও স্বর্ণালু (Emerald & Gold)", nameEn: "Emerald & Gold", colorPreview: "from-emerald-500 to-amber-500" },
    { id: "royal_blue", nameBn: "রয়েল ব্লু ও সাইয়ান (Royal Blue)", nameEn: "Royal Blue", colorPreview: "from-blue-600 to-cyan-400" },
    { id: "neon_purple", nameBn: "নিওন পার্পল ও পিঙ্ক (Neon Purple)", nameEn: "Neon Purple", colorPreview: "from-purple-600 to-pink-500" },
    { id: "sunset_orange", nameBn: "সানসেট অরেঞ্জ (Sunset Orange)", nameEn: "Sunset Orange", colorPreview: "from-orange-500 to-rose-600" },
    { id: "crimson_red", nameBn: "ক্রিমসন রেড (Ruby Red)", nameEn: "Ruby Red", colorPreview: "from-red-600 to-amber-400" },
    { id: "golden_luxury", nameBn: "গোল্ডেন লাক্সারি (Golden Luxury)", nameEn: "Golden Luxury", colorPreview: "from-amber-600 to-yellow-300" },
  ];

  // Preset Icon Shapes
  const iconsList: { id: LogoConfig["iconType"]; labelBn: string; icon: React.ReactNode }[] = [
    { id: "peanut", labelBn: "🥜 বাদাম আইকন", icon: "🥜" },
    { id: "sparkle", labelBn: "✨ উজ্জ্বল নক্ষত্র", icon: <Sparkles className="w-5 h-5 text-amber-300" /> },
    { id: "crescent", labelBn: "🌙 চাঁদ আইকন", icon: <Moon className="w-5 h-5 text-amber-200" /> },
    { id: "chat", labelBn: "💬 চ্যাট বাবুল", icon: <MessageSquare className="w-5 h-5 text-cyan-300" /> },
    { id: "crown", labelBn: "👑 রয়্যাল ক্রাউন", icon: <Crown className="w-5 h-5 text-yellow-300" /> },
    { id: "shield", labelBn: "🛡️ সেফটি শিল্ড", icon: <Shield className="w-5 h-5 text-blue-300" /> },
    { id: "globe", labelBn: "🌐 গ্লোবাল ওয়ার্ল্ড", icon: <Globe className="w-5 h-5 text-emerald-300" /> },
    { id: "custom_image", labelBn: "🖼️ গ্যালারির ছবি (Gallery Photo)", icon: "🖼️" },
  ];

  // Shape options
  const shapeOptions: { id: LogoConfig["shape"]; labelBn: string }[] = [
    { id: "classic_circle", labelBn: "বৃত্তাকার (Circle)" },
    { id: "rounded_squircle", labelBn: "স্কোয়ারকেল (Squircle)" },
    { id: "glowing_hexagon", labelBn: "হেক্সাগন (Hexagon)" },
    { id: "pill_badge", labelBn: "পিল ব্যাজ (Pill Badge)" },
  ];

  if (!isLogoModalOpen) return null;

  return (
    <div
      onClick={() => setIsLogoModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-2xl border border-white/20">
              <Palette className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl">
                  {language === "bn" ? "🎨 লোগো ডিজাইন কাস্টমাইজেশন" : "🎨 Customize App Logo Design"}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                  <Crown className="w-3 h-3 text-slate-950" />
                  {language === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                {language === "bn"
                  ? "আপনার গ্যালারি থেকে নিজস্ব ছবি বা আইকন দিয়ে অ্যাপের ব্র্যান্ডিং তৈরি করুন"
                  : "Personalize app header logo from gallery or web URL"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLogoModalOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 bg-slate-900 text-white shrink-0 border-b border-slate-800">
          <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1 mb-2">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            {language === "bn" ? "লাইভ হেডার প্রিভিউ (Live Header Preview)" : "Live Header Preview"}
          </span>

          <div className="bg-blue-700/80 p-3.5 rounded-2xl border border-blue-500/50 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              {/* Render dynamic logo using draftConfig */}
              <div className="flex items-center gap-2">
                <div
                  className={`relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gradient-to-tr ${
                    themeGradients.find((g) => g.id === draftConfig.themeGradient)?.colorPreview || "from-emerald-500 to-amber-500"
                  } ${draftConfig.shape === "rounded_squircle" ? "rounded-xl" : draftConfig.shape === "glowing_hexagon" ? "rounded-lg rotate-3" : "rounded-full"} ${
                    draftConfig.showGlow ? "shadow-md ring-2 ring-white/40" : ""
                  }`}
                >
                  {draftConfig.iconType === "custom_image" && draftConfig.customImageUrl ? (
                    <img src={draftConfig.customImageUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : draftConfig.iconType === "sparkle" ? (
                    <Sparkles className="w-5 h-5 text-amber-200" />
                  ) : draftConfig.iconType === "crescent" ? (
                    <Moon className="w-5 h-5 text-amber-200 fill-current" />
                  ) : draftConfig.iconType === "chat" ? (
                    <MessageSquare className="w-5 h-5 text-cyan-200 fill-current" />
                  ) : draftConfig.iconType === "crown" ? (
                    <Crown className="w-5 h-5 text-yellow-300 fill-current" />
                  ) : draftConfig.iconType === "shield" ? (
                    <Shield className="w-5 h-5 text-blue-200 fill-current" />
                  ) : draftConfig.iconType === "globe" ? (
                    <Globe className="w-5 h-5 text-emerald-200" />
                  ) : (
                    <span className="text-xl">🥜</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-black text-base text-white leading-tight">
                    {draftConfig.appTitle || "Chinabadam"}
                  </span>
                  <span className="text-[10px] font-bold text-amber-300 leading-tight">
                    {draftConfig.appSubtitle || "অচেনা থেকে আপনজন"}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[11px] font-black bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-xs">
              {language === "bn" ? "প্রিভিউ মোড" : "Live Preview"}
            </span>
          </div>
        </div>

        {/* Scrollable Customization Controls */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 text-xs">
          
          {/* 1. App Title & Subtitle Branding Text */}
          <div className="space-y-2">
            <label className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
              <Type className="w-4 h-4 text-blue-600" />
              <span>{language === "bn" ? "১. লোগোর টেক্সট ও ব্র্যান্ড নেম (Logo Title)" : "1. Logo Brand Name & Subtitle"}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  {language === "bn" ? "মূল শিরোনাম (App Title):" : "App Title:"}
                </span>
                <input
                  type="text"
                  value={draftConfig.appTitle}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, appTitle: e.target.value }))}
                  placeholder="যেমন: Chinabadam / চিনা বাদাম"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-black text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">
                  {language === "bn" ? "ট্যাগলাইন / সাবটাইটেল:" : "Subtitle Tagline:"}
                </span>
                <input
                  type="text"
                  value={draftConfig.appSubtitle}
                  onChange={(e) => setDraftConfig((prev) => ({ ...prev, appSubtitle: e.target.value }))}
                  placeholder="যেমন: অচেনা থেকে আপনজন"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Choose Icon Symbol */}
          <div className="space-y-2">
            <label className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{language === "bn" ? "২. লোগো প্রতীক / আইকন নির্বাচন" : "2. Choose Logo Icon Symbol"}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {iconsList.map((ic) => {
                const isSel = draftConfig.iconType === ic.id;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setDraftConfig((prev) => ({ ...prev, iconType: ic.id }))}
                    className={`p-2.5 rounded-2xl border text-left font-bold transition flex items-center gap-2 ${
                      isSel
                        ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-2 ring-blue-500/30"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-base shrink-0">{ic.icon}</span>
                    <span className="text-[11px] truncate font-extrabold">{ic.labelBn}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Gallery Upload Section */}
            {draftConfig.iconType === "custom_image" && (
              <div className="mt-2 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl space-y-3 shadow-xs">
                <span className="text-[11px] font-black text-amber-950 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-amber-600" />
                  {language === "bn"
                    ? "ফোন বা ডিভাইস গ্যালারি থেকে সরাসরি ছবি বা লোগো সিলেক্ট করুন:"
                    : "Upload Photo/Logo directly from Device Gallery:"}
                </span>

                {/* Primary Gallery Picker - Nested Input inside Label for 100% native trigger */}
                <label className="w-full cursor-pointer bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-800 active:scale-98 text-white font-black px-4 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition select-none">
                  <Upload className="w-5 h-5 text-amber-100 shrink-0" />
                  <span>
                    {language === "bn"
                      ? "📁 গ্যালারি থেকে ছবি বেছে নিন (Open Gallery)"
                      : "📁 Choose Photo from Gallery"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct Native Browser File Input */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-white/90 border border-amber-200 rounded-xl">
                  <span className="text-[11px] font-extrabold text-slate-800 shrink-0">
                    {language === "bn" ? "অথবা ব্রাউজার ফাইল সিলেক্টর:" : "Or Direct File Picker:"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-700 font-bold file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer w-full"
                  />
                </div>

                {/* Selected Image Preview Thumbnail */}
                {draftConfig.customImageUrl ? (
                  <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-amber-200 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={draftConfig.customImageUrl}
                        alt="Uploaded Logo Preview"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-300 shrink-0 shadow-xs"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-emerald-700 block truncate">
                          {language === "bn"
                            ? "✅ গ্যালারির ছবি সফলভাবে সেট হয়েছে"
                            : "✅ Gallery photo set successfully"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          {language === "bn"
                            ? "নিচে 'লোগো কাস্টমাইজেশন সেভ করুন' চাপ দিন"
                            : "Click Save button below"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftConfig((prev) => ({
                          ...prev,
                          customImageUrl: "",
                          iconType: "peanut",
                        }))
                      }
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title={language === "bn" ? "ছবি মুছে ফেলুন" : "Remove Photo"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-amber-800 text-center">
                    {language === "bn"
                      ? "💡 বাটনটিতে চাপ দিলে ফোনের গ্যালারি খুলে যাবে, সেখান থেকে যেকোনো JPG/PNG ছবি বেছে নিন"
                      : "💡 Tap button to open photo gallery on phone/PC"}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 3. Color Palette & Gradient */}
          <div className="space-y-2">
            <label className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
              <Palette className="w-4 h-4 text-purple-600" />
              <span>{language === "bn" ? "৩. লোগো ব্যাকগ্রাউন্ড কালার থিম" : "3. Background Color Gradient Theme"}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {themeGradients.map((tg) => {
                const isSel = draftConfig.themeGradient === tg.id;
                return (
                  <button
                    key={tg.id}
                    onClick={() => setDraftConfig((prev) => ({ ...prev, themeGradient: tg.id }))}
                    className={`p-2.5 rounded-2xl border text-left font-extrabold transition flex items-center justify-between ${
                      isSel
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500/40"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${tg.colorPreview} shadow-xs`} />
                      <span className="text-[11px]">{tg.nameBn}</span>
                    </div>
                    {isSel && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Logo Shape & Effects */}
          <div className="space-y-2">
            <label className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{language === "bn" ? "৪. ব্যাজের শেপ ও স্পেশাল গ্লো ইফেক্ট" : "4. Badge Shape & Glow Effects"}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {shapeOptions.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => setDraftConfig((prev) => ({ ...prev, shape: sh.id }))}
                  className={`p-2.5 rounded-2xl border font-extrabold text-[11px] transition ${
                    draftConfig.shape === sh.id
                      ? "bg-emerald-700 text-white border-emerald-800 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {sh.labelBn}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 mt-2">
              <span className="font-extrabold text-slate-800">
                {language === "bn" ? "অরা গ্লো ও নিয়ন রিং শ্যাডো" : "Outer Glow & Ring Shadow"}
              </span>
              <button
                onClick={() => setDraftConfig((prev) => ({ ...prev, showGlow: !prev.showGlow }))}
                className={`w-12 h-6 rounded-full p-1 transition ${
                  draftConfig.showGlow ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition transform ${
                    draftConfig.showGlow ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-extrabold rounded-2xl text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>{language === "bn" ? "ডিফল্ট লোগোতে ফেরত যান" : "Reset to Default"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogoModalOpen(false)}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold rounded-2xl text-xs transition"
            >
              {language === "bn" ? "বাতিল" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{language === "bn" ? "লোগো কাস্টমাইজেশন সেভ করুন" : "Save Custom Logo"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
