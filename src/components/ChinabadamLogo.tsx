import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Moon, MessageSquare, Crown, Shield, Globe, Heart } from "lucide-react";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
  className?: string;
  overrideTitle?: string;
}

export const ChinabadamLogo: React.FC<Props> = ({
  size = "md",
  showText = true,
  textColor = "text-white",
  className = "",
  overrideTitle,
}) => {
  let logoConfig;
  try {
    const context = useApp();
    logoConfig = context.logoConfig;
  } catch {
    logoConfig = undefined;
  }

  const iconType = logoConfig?.iconType || "peanut";
  const themeGradient = logoConfig?.themeGradient || "emerald_gold";
  const shape = logoConfig?.shape || "classic_circle";
  const displayTitle = overrideTitle || logoConfig?.appTitle || "Chinabadam";
  const displaySubtitle = logoConfig?.appSubtitle || "অচেনা থেকে আপনজন";
  const customImageUrl = logoConfig?.customImageUrl;
  const showGlow = logoConfig?.showGlow ?? true;
  const isAnimated = logoConfig?.isAnimated ?? true;

  const dimensions = {
    sm: { icon: "w-8 h-8", text: "text-lg", sub: "text-[9px]" },
    md: { icon: "w-11 h-11", text: "text-xl", sub: "text-[11px]" },
    lg: { icon: "w-16 h-16", text: "text-3xl", sub: "text-xs" },
  }[size];

  // Theme Gradient Maps
  const gradientClasses = {
    emerald_gold: "from-emerald-500 via-amber-500 to-yellow-400 text-slate-950",
    royal_blue: "from-blue-600 via-indigo-500 to-cyan-400 text-white",
    neon_purple: "from-purple-600 via-pink-500 to-rose-400 text-white",
    sunset_orange: "from-orange-500 via-amber-500 to-rose-600 text-white",
    crimson_red: "from-red-600 via-rose-500 to-amber-400 text-white",
    golden_luxury: "from-amber-600 via-yellow-400 to-amber-200 text-slate-950",
  }[themeGradient] || "from-emerald-500 to-amber-500 text-white";

  // Shape classes
  const shapeClass = {
    classic_circle: "rounded-full",
    rounded_squircle: "rounded-2xl",
    glowing_hexagon: "rounded-xl transform rotate-3",
    pill_badge: "rounded-2xl",
  }[shape] || "rounded-full";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Dynamic Logo Badge */}
      <div
        className={`relative ${dimensions.icon} flex items-center justify-center shrink-0 drop-shadow-md bg-gradient-to-tr ${gradientClasses} ${shapeClass} ${
          showGlow ? "shadow-lg ring-2 ring-white/30" : ""
        } ${isAnimated ? "transition-all duration-300 hover:scale-105" : ""} overflow-hidden`}
      >
        {iconType === "custom_image" && customImageUrl ? (
          <img
            src={customImageUrl}
            alt="Custom Logo"
            className="w-full h-full object-cover"
          />
        ) : iconType === "sparkle" ? (
          <Sparkles className="w-3/5 h-3/5 drop-shadow-xs" />
        ) : iconType === "crescent" ? (
          <Moon className="w-3/5 h-3/5 drop-shadow-xs fill-current" />
        ) : iconType === "chat" ? (
          <MessageSquare className="w-3/5 h-3/5 drop-shadow-xs fill-current" />
        ) : iconType === "crown" ? (
          <Crown className="w-3/5 h-3/5 drop-shadow-xs fill-current" />
        ) : iconType === "shield" ? (
          <Shield className="w-3/5 h-3/5 drop-shadow-xs fill-current" />
        ) : iconType === "globe" ? (
          <Globe className="w-3/5 h-3/5 drop-shadow-xs" />
        ) : (
          /* Default Original Vector Peanut Icon */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1 overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bottomPeanutGrad" x1="10" y1="40" x2="70" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="topPeanutGrad" x1="30" y1="10" x2="90" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="88" rx="42" ry="9" fill="url(#groundShadow)" />
            <g transform="rotate(22 45 60)">
              <path
                d="M 22 62 C 14 50, 16 34, 28 26 C 38 18, 50 26, 54 34 C 58 42, 68 40, 76 48 C 86 58, 82 76, 68 82 C 54 88, 42 78, 38 70 C 34 62, 26 68, 22 62 Z"
                fill="url(#bottomPeanutGrad)"
                stroke="#78350f"
                strokeWidth="1.5"
              />
            </g>
            <g transform="rotate(-28 52 42)">
              <path
                d="M 20 50 C 12 36, 16 18, 32 12 C 46 6, 58 16, 62 26 C 66 36, 76 34, 84 44 C 94 56, 88 78, 70 82 C 52 86, 42 72, 38 62 C 34 52, 24 58, 20 50 Z"
                fill="url(#topPeanutGrad)"
                stroke="#fef3c7"
                strokeWidth="2"
              />
            </g>
          </svg>
        )}
      </div>

      {/* Brand Title and Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black ${dimensions.text} tracking-tight ${textColor} drop-shadow-sm leading-none`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {displayTitle}
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 opacity-90 leading-tight mt-0.5">
            {displaySubtitle}
          </span>
        </div>
      )}
    </div>
  );
};
