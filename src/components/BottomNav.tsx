import React from "react";
import { useApp } from "../context/AppContext";
import { Home, MapPin, MessageSquare, Users, User, Compass, Moon } from "lucide-react";
import { NavTab } from "../types";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, conversations, notifications } = useApp();

  const totalUnreadChat = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: "home", label: t("home"), icon: "🏠" },
    { id: "map", label: t("map"), icon: "🗺️" },
    { id: "chat", label: t("chat"), icon: "💬" },
    { id: "circle", label: t("circle"), icon: "📢" },
    { id: "profile", label: t("profile"), icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
                isActive ? "text-blue-700 font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium tracking-tight truncate max-w-full px-1">
                {item.label}
              </span>

              {item.id === "chat" && totalUnreadChat > 0 && (
                <span className="absolute top-1 right-3 px-1.5 py-0.5 text-[9px] font-extrabold bg-red-500 text-white rounded-full">
                  {totalUnreadChat}
                </span>
              )}

              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-blue-700 rounded-t-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
