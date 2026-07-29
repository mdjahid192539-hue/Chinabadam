import React from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const ChinabadamLogo: React.FC<Props> = ({
  size = "md",
  showText = true,
  textColor = "text-white",
  className = "",
}) => {
  const dimensions = {
    sm: { icon: "w-8 h-8", text: "text-lg", sub: "text-[10px]" },
    md: { icon: "w-11 h-11", text: "text-xl", sub: "text-[11px]" },
    lg: { icon: "w-16 h-16", text: "text-3xl", sub: "text-xs" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Vector Dual-Peanut Icon with Overlapping Elevation and Soft Shadow */}
      <div className={`relative ${dimensions.icon} flex items-center justify-center shrink-0 drop-shadow-md`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ground Shadow Gradient */}
            <radialGradient
              id="groundShadow"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#0f172a" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            {/* Bottom Peanut Color Gradient */}
            <linearGradient
              id="bottomPeanutGrad"
              x1="10"
              y1="40"
              x2="70"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Top Raised Peanut Color Gradient */}
            <linearGradient
              id="topPeanutGrad"
              x1="30"
              y1="10"
              x2="90"
              y2="70"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Top Peanut Drop Shadow onto Bottom Peanut */}
            <filter id="topPeanutShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow
                dx="-2"
                dy="4"
                stdDeviation="3"
                floodColor="#451a03"
                floodOpacity="0.65"
              />
            </filter>
          </defs>

          {/* 1. Soft Ground Shadow under both peanuts */}
          <ellipse
            cx="50"
            cy="88"
            rx="42"
            ry="9"
            fill="url(#groundShadow)"
          />

          {/* 2. Bottom Peanut (Tilted right/down, sitting underneath) */}
          <g transform="rotate(22 45 60)">
            {/* Peanut Pod Path */}
            <path
              d="M 22 62 C 14 50, 16 34, 28 26 C 38 18, 50 26, 54 34 C 58 42, 68 40, 76 48 C 86 58, 82 76, 68 82 C 54 88, 42 78, 38 70 C 34 62, 26 68, 22 62 Z"
              fill="url(#bottomPeanutGrad)"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            {/* Texture ridgelines */}
            <path
              d="M 26 34 C 32 30, 42 36, 46 44 M 60 48 C 68 52, 74 64, 68 74"
              stroke="#fbbf24"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          {/* 3. Top Peanut (Raised higher, overlapping on top, with distinct shadow) */}
          <g transform="rotate(-28 52 42)" filter="url(#topPeanutShadow)">
            {/* Upper Peanut Shell Body */}
            <path
              d="M 20 50 C 12 36, 16 18, 32 12 C 46 6, 58 16, 62 26 C 66 36, 76 34, 84 44 C 94 56, 88 78, 70 82 C 52 86, 42 72, 38 62 C 34 52, 24 58, 20 50 Z"
              fill="url(#topPeanutGrad)"
              stroke="#fef3c7"
              strokeWidth="2"
            />
            {/* Highlight Shine on top peanut */}
            <path
              d="M 28 20 C 36 14, 46 18, 50 26"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Peanut Shell Crosshatch / Waist Line */}
            <path
              d="M 38 62 C 36 50, 44 38, 52 26"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            <path
              d="M 64 42 C 72 48, 78 62, 72 72"
              stroke="#fef08a"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>

      {/* Brand Name in English as explicitly requested: "Chinabadam" */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black ${dimensions.text} tracking-tight ${textColor} drop-shadow-sm leading-none`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Chinabadam
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-300 opacity-90 leading-tight mt-0.5">
            অচেনা থেকে আপনজন
          </span>
        </div>
      )}
    </div>
  );
};
