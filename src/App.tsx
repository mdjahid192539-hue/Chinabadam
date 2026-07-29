import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { HomeView } from "./components/HomeView";
import { LiveMap } from "./components/LiveMap";
import { ChatView } from "./components/ChatView";
import { ChinabadamCircle } from "./components/ChinabadamCircle";
import { ProfileView } from "./components/ProfileView";
import { IslamicCorner } from "./components/IslamicCorner";
import { SportsSection } from "./components/SportsSection";
import { TourismSection } from "./components/TourismSection";
import { NotificationsView } from "./components/NotificationsView";
import { SettingsView } from "./components/SettingsView";
import { FindPeople } from "./components/FindPeople";
import { AuthModal } from "./components/AuthModal";

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 pt-4 px-3 sm:px-6">
      {activeTab === "home" && <HomeView />}
      {activeTab === "map" && <LiveMap />}
      {activeTab === "chat" && <ChatView />}
      {activeTab === "circle" && <ChinabadamCircle />}
      {activeTab === "profile" && <ProfileView />}
      {activeTab === "islamic" && <IslamicCorner />}
      {activeTab === "sports" && <SportsSection />}
      {activeTab === "tourism" && <TourismSection />}
      {activeTab === "notifications" && <NotificationsView />}
      {activeTab === "settings" && <SettingsView />}
      {activeTab === "people" && <FindPeople />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 selection:text-blue-900">
        <Header />
        <MainContent />
        <BottomNav />
        <AuthModal />
      </div>
    </AppProvider>
  );
}
