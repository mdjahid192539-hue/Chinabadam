import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  NavTab,
  UserProfile,
  NearbyUser,
  GlobalUser,
  CirclePost,
  EventAlert,
  Mosque,
  TourismSpot,
  SportsGame,
  AppNotification,
  Conversation,
  ChatMessage,
  LogoConfig,
} from "../types";
import {
  initialCurrentUser,
  mockNearbyUsers,
  mockGlobalUsers,
  mockCirclePosts,
  mockEventAlerts,
  mockMosques,
  mockTourismSpots,
  mockSportsGames,
  mockNotifications,
  mockConversations
} from "../data/mockData";
import { getTranslation } from "../utils/translations";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  nearbyUsers: NearbyUser[];
  globalUsers: GlobalUser[];
  circlePosts: CirclePost[];
  eventAlerts: EventAlert[];
  notifications: AppNotification[];
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  mosques: Mosque[];
  tourismSpots: TourismSpot[];
  sportsGames: SportsGame[];
  selectedMapTab: "nearby" | "global";
  setSelectedMapTab: (tab: "nearby" | "global") => void;
  mapFilter: "all" | "users" | "mosques" | "tourism" | "sports";
  setMapFilter: (filter: "all" | "users" | "mosques" | "tourism" | "sports") => void;
  
  // Helpers
  t: (key: Parameters<typeof getTranslation>[1]) => string;
  sendFriendRequest: (userId: string) => void;
  startChatWithUser: (user: NearbyUser | GlobalUser) => void;
  sendMessage: (convId: string, text?: string, imageUrl?: string, audioUrl?: string) => void;
  addCirclePost: (post: Omit<CirclePost, "id" | "likes" | "timestamp" | "comments" | "authorId" | "authorName" | "authorAvatar">) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  joinSportsGame: (gameId: string) => void;
  dismissEventAlert: (alertId: string) => void;
  markNotificationRead: (notifId: string) => void;
  watchAdAndEarn: (rewardAmount: number, adTitle?: string) => void;
  requestWithdrawal: (amount: number, method: "bkash" | "nagad" | "rocket" | "recharge", accountNumber: string) => { success: boolean; message: string };
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Logo Customization State & Functions
  logoConfig: LogoConfig;
  updateLogoConfig: (updated: Partial<LogoConfig>) => void;
  resetLogoConfig: () => void;
  isLogoModalOpen: boolean;
  setIsLogoModalOpen: (open: boolean) => void;

  // Group Chat Creation
  createGroupChat: (groupName: string, description: string, members: (NearbyUser | GlobalUser)[], avatarUrl?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("bn");
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialCurrentUser);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>(mockNearbyUsers);
  const [globalUsers, setGlobalUsers] = useState<GlobalUser[]>(mockGlobalUsers);
  const [circlePosts, setCirclePosts] = useState<CirclePost[]>(mockCirclePosts);
  const [eventAlerts, setEventAlerts] = useState<EventAlert[]>(mockEventAlerts);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv_1");
  const [mosques] = useState<Mosque[]>(mockMosques);
  const [tourismSpots] = useState<TourismSpot[]>(mockTourismSpots);
  const [sportsGames, setSportsGames] = useState<SportsGame[]>(mockSportsGames);
  const [selectedMapTab, setSelectedMapTab] = useState<"nearby" | "global">("nearby");
  const [mapFilter, setMapFilter] = useState<"all" | "users" | "mosques" | "tourism" | "sports">("all");
  const defaultLogoConfig: LogoConfig = {
    iconType: "peanut",
    themeGradient: "emerald_gold",
    shape: "classic_circle",
    appTitle: "চিনা বাদাম",
    appSubtitle: "দেশজুড়ে বন্ধু ও সামাজিক নেটওয়ার্ক",
    showGlow: true,
    isAnimated: true,
  };

  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => {
    try {
      const saved = localStorage.getItem("chinabadam_logo_config");
      return saved ? JSON.parse(saved) : defaultLogoConfig;
    } catch {
      return defaultLogoConfig;
    }
  });

  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const updateLogoConfig = (updated: Partial<LogoConfig>) => {
    setLogoConfig((prev) => {
      const newConf = { ...prev, ...updated };
      try {
        localStorage.setItem("chinabadam_logo_config", JSON.stringify(newConf));
      } catch (e) {
        console.error(e);
      }
      return newConf;
    });
  };

  const resetLogoConfig = () => {
    setLogoConfig(defaultLogoConfig);
    try {
      localStorage.removeItem("chinabadam_logo_config");
    } catch (e) {
      console.error(e);
    }
  };

  const createGroupChat = (
    groupName: string,
    description: string,
    members: (NearbyUser | GlobalUser)[],
    avatarUrl?: string
  ) => {
    const groupId = `group_${Date.now()}`;
    const newGroupConv: Conversation = {
      id: groupId,
      peerUser: members[0] || mockNearbyUsers[0],
      isGroup: true,
      groupName,
      groupAvatar: avatarUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=250",
      groupDescription: description || "বন্ধুদের নতুন গ্রুপ আড্ডা ☕",
      groupMembers: members,
      groupAdminId: currentUser.id,
      lastMessage: `${currentUser.realName}: 'গ্রুপ তৈরি করা হয়েছে'`,
      lastMessageTime: "এখনই",
      unreadCount: 0,
      messages: [
        {
          id: `gm_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: groupId,
          senderName: currentUser.realName,
          senderAvatar: currentUser.avatar,
          text: language === "bn"
            ? `🎉 "${groupName}" গ্রুপ তৈরি করা হয়েছে! সকলে আড্ডায় যোগ দিন।`
            : `🎉 "${groupName}" group created! Welcome everyone.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        },
      ],
    };

    setConversations((prev) => [newGroupConv, ...prev]);
    setActiveConversationId(groupId);
    setActiveTab("chat");

    const newNotif: AppNotification = {
      id: `n_${Date.now()}`,
      title: language === "bn" ? "নতুন গ্রুপ তৈরি হয়েছে 🎉" : "Group Created",
      message: `${groupName} গ্রুপটি তৈরি করা হয়েছে।`,
      timestamp: "এখনই",
      isRead: false,
      type: "circle",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const sendFriendRequest = (userId: string) => {
    setNearbyUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, requestPending: true } : u))
    );
    setGlobalUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, requestPending: true } : u))
    );

    // Add a local notification trigger
    const newNotif: AppNotification = {
      id: `n_${Date.now()}`,
      title: language === "bn" ? "ফ্রেন্ড রিকোয়েস্ট পাঠানো হয়েছে" : "Friend Request Sent",
      message: language === "bn" ? "ব্যবহারকারীর সাড়ার অপেক্ষা করুন।" : "Waiting for response.",
      timestamp: "এখনই",
      isRead: false,
      type: "request",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const startChatWithUser = (user: NearbyUser | GlobalUser) => {
    let conv = conversations.find((c) => c.peerUser.id === user.id);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        peerUser: user,
        lastMessage: language === "bn" ? "নতুন চ্যাট শুরু হয়েছে" : "New Chat Started",
        lastMessageTime: "এখনই",
        unreadCount: 0,
        messages: [
          {
            id: `m_${Date.now()}`,
            senderId: currentUser.id,
            receiverId: user.id,
            text: language === "bn" ? "আসসালামু আলাইকুম! চিনা বাদামে স্বাগতম।" : "Assalamu Alaikum! Welcome to Chinabadam.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          },
        ],
      };
      setConversations((prev) => [conv!, ...prev]);
    }
    setActiveConversationId(conv.id);
    setActiveTab("chat");
  };

  const sendMessage = (convId: string, text?: string, imageUrl?: string, audioUrl?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== convId) return conv;
        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          receiverId: conv.peerUser.id,
          text,
          imageUrl,
          audioUrl,
          timestamp: timeNow,
          isRead: true,
        };
        const updatedMsgs = [...conv.messages, newMsg];
        return {
          ...conv,
          messages: updatedMsgs,
          lastMessage: text || (imageUrl ? (language === "bn" ? "📷 ছবি পাঠানো হয়েছে" : "📷 Photo sent") : (language === "bn" ? "🎙️ ভয়েস মেসেজ" : "🎙️ Voice message")),
          lastMessageTime: timeNow,
        };
      })
    );
  };

  const addCirclePost = (post: Omit<CirclePost, "id" | "likes" | "timestamp" | "comments" | "authorId" | "authorName" | "authorAvatar">) => {
    const newPost: CirclePost = {
      ...post,
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.realName,
      authorAvatar: currentUser.avatar,
      likes: 0,
      timestamp: language === "bn" ? "এখনই" : "Just now",
      comments: [],
    };
    setCirclePosts((prev) => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setCirclePosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setCirclePosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c_${Date.now()}`,
              authorName: currentUser.realName,
              authorAvatar: currentUser.avatar,
              text,
              timestamp: language === "bn" ? "এখনই" : "Just now",
            },
          ],
        };
      })
    );
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const joinSportsGame = (gameId: string) => {
    setSportsGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        if (g.joinedCount < g.totalNeeded) {
          return { ...g, joinedCount: g.joinedCount + 1 };
        }
        return g;
      })
    );
  };

  const dismissEventAlert = (alertId: string) => {
    setEventAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const watchAdAndEarn = (rewardAmount: number, adTitle?: string) => {
    setCurrentUser((prev) => {
      const newWalletBalance = Number((prev.walletBalance + rewardAmount).toFixed(2));
      const newTodayEarnings = Number((prev.todayEarnings + rewardAmount).toFixed(2));
      const newAdsCount = prev.adsWatchedToday + 1;
      return {
        ...prev,
        walletBalance: newWalletBalance,
        todayEarnings: newTodayEarnings,
        adsWatchedToday: newAdsCount,
      };
    });

    // Send a notification
    const newNotif: AppNotification = {
      id: `ad_n_${Date.now()}`,
      title: language === "bn" ? "🎉 আয় রিওয়ার্ড সফল!" : "🎉 Ad Reward Earned!",
      message: language === "bn" 
        ? `বিজ্ঞাপন "${adTitle || 'স্পন্সর ভিডিও'}" সফলভাবে দেখে ৳ ${rewardAmount.toFixed(2)} আয় করেছেন!`
        : `Earned ৳ ${rewardAmount.toFixed(2)} for watching ad "${adTitle || 'Sponsored Video'}"!`,
      timestamp: "এখনই",
      isRead: false,
      type: "alert",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const requestWithdrawal = (
    amount: number,
    method: "bkash" | "nagad" | "rocket" | "recharge",
    accountNumber: string
  ) => {
    if (amount <= 0) {
      return { success: false, message: language === "bn" ? "সঠিক টাকার পরিমাণ প্রদান করুন।" : "Enter a valid amount." };
    }
    if (currentUser.walletBalance < amount) {
      return { success: false, message: language === "bn" ? "পর্যাপ্ত ব্যালেন্স নেই।" : "Insufficient balance." };
    }
    if (!accountNumber || accountNumber.trim().length < 10) {
      return { success: false, message: language === "bn" ? "সঠিক অ্যাকাউন্ট/মোবাইল নম্বর লিখুন।" : "Enter valid account/mobile number." };
    }

    const methodNameBn = {
      bkash: "বিকাশ",
      nagad: "নগদ",
      rocket: "রকেট",
      recharge: "মোবাইল রিচার্জ",
    }[method];

    setCurrentUser((prev) => {
      const newRecord = {
        id: `w_${Date.now()}`,
        amount,
        method,
        accountNumber,
        status: "processing" as const,
        timestamp: language === "bn" ? "এখনই প্রসেসিং" : "Processing now",
      };
      return {
        ...prev,
        walletBalance: Number((prev.walletBalance - amount).toFixed(2)),
        withdrawHistory: [newRecord, ...prev.withdrawHistory],
      };
    });

    // Add notification
    const newNotif: AppNotification = {
      id: `w_n_${Date.now()}`,
      title: language === "bn" ? "💸 ক্যাশআউট অনুেরাধ গৃহীত" : "💸 Cash Out Request Submitted",
      message: language === "bn"
        ? `${methodNameBn} (${accountNumber}) নম্বরে ৳ ${amount} উত্তোলনের অনুরোধ প্রসেস হচ্ছে।`
        : `Withdrawal request of ৳ ${amount} via ${method} (${accountNumber}) is processing.`,
      timestamp: "এখনই",
      isRead: false,
      type: "alert",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return {
      success: true,
      message: language === "bn"
        ? `৳ ${amount} ${methodNameBn}-এ উত্তোলনের অনুরোধ সফলভাবে পাঠানো হয়েছে!`
        : `Withdrawal request of ৳ ${amount} submitted successfully!`,
    };
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        nearbyUsers,
        globalUsers,
        circlePosts,
        eventAlerts,
        notifications,
        conversations,
        activeConversationId,
        setActiveConversationId,
        mosques,
        tourismSpots,
        sportsGames,
        selectedMapTab,
        setSelectedMapTab,
        mapFilter,
        setMapFilter,
        t,
        sendFriendRequest,
        startChatWithUser,
        sendMessage,
        addCirclePost,
        likePost,
        addComment,
        updateUserProfile,
        joinSportsGame,
        dismissEventAlert,
        markNotificationRead,
        watchAdAndEarn,
        requestWithdrawal,
        isLoginModalOpen,
        setIsLoginModalOpen,
        logoConfig,
        updateLogoConfig,
        resetLogoConfig,
        isLogoModalOpen,
        setIsLogoModalOpen,
        createGroupChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
