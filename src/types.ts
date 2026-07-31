export type Language = 
  | "bn" 
  | "en" 
  | "ar" 
  | "hi" 
  | "es" 
  | "fr" 
  | "de" 
  | "zh" 
  | "ja" 
  | "ru" 
  | "pt" 
  | "ur" 
  | "ms" 
  | "tr" 
  | "it" 
  | "ko" 
  | "fa" 
  | "id" 
  | "vi" 
  | "th" 
  | "nl" 
  | "pl" 
  | "sv" 
  | "el";

export type NavTab = 
  | "home" 
  | "map" 
  | "chat" 
  | "circle" 
  | "profile" 
  | "islamic" 
  | "sports" 
  | "tourism" 
  | "notifications" 
  | "settings" 
  | "people";

export interface WithdrawRecord {
  id: string;
  amount: number;
  method: "bkash" | "nagad" | "rocket" | "recharge";
  accountNumber: string;
  status: "pending" | "completed" | "processing";
  timestamp: string;
}

export interface UserProfile {
  id: string;
  isAdmin?: boolean; // App Owner / Admin permission flag for Logo & System Customization
  phone: string; // Hidden in public UI!
  realName: string; // Mandatory real name (আসল নাম)
  avatar: string;
  dob: string;
  gender: "পুরুষ" | "নারী" | "অন্যান্য" | "Male" | "Female" | "Other";
  country: string;
  district: string;
  bio: string;
  interests: string[];
  isOnline: boolean;
  friendsCount: number;
  latitude: number;
  longitude: number;
  // Earn Wallet System
  walletBalance: number; // In BDT (৳)
  todayEarnings: number;
  adsWatchedToday: number;
  dailyStreakDays: number;
  withdrawHistory: WithdrawRecord[];
}

export interface NearbyUser {
  id: string;
  realName: string;
  avatar: string;
  country: string;
  district: string;
  distanceKm: number;
  isOnline: boolean;
  lastActive: string;
  bio: string;
  interests: string[];
  latitude: number;
  longitude: number;
  isFriend?: boolean;
  requestPending?: boolean;
}

export interface GlobalUser {
  id: string;
  realName: string;
  avatar: string;
  country: string;
  city: string;
  isOnline: boolean;
  lastActive: string;
  bio: string;
  interests: string[];
  latitude: number;
  longitude: number;
  isFriend?: boolean;
  requestPending?: boolean;
}

export interface LogoConfig {
  iconType: "peanut" | "sparkle" | "crescent" | "chat" | "crown" | "shield" | "globe" | "custom_image";
  customImageUrl?: string;
  themeGradient: "emerald_gold" | "royal_blue" | "neon_purple" | "sunset_orange" | "crimson_red" | "golden_luxury";
  shape: "classic_circle" | "rounded_squircle" | "glowing_hexagon" | "pill_badge";
  appTitle: string;
  appSubtitle: string;
  showGlow: boolean;
  isAnimated: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  senderName?: string;
  senderAvatar?: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  location?: { lat: number; lng: number; address: string };
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  peerUser: NearbyUser | GlobalUser;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  // Group Chat Attributes
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupDescription?: string;
  groupMembers?: (NearbyUser | GlobalUser)[];
  groupAdminId?: string;
  isVoiceCallActive?: boolean;
}

export type CircleCategory = 
  | "মাহফিল" 
  | "খেলার আয়োজন" 
  | "ভ্রমণ" 
  | "রক্তদাতা" 
  | "চাকরির খবর" 
  | "স্থানীয় আলোচনা";

export interface CirclePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorDistrict: string;
  category: CircleCategory;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  isLiked?: boolean;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    text: string;
    timestamp: string;
  }[];
  timestamp: string;
  locationName: string;
}

export interface EventAlert {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: "blood" | "sports" | "prayer" | "mahfil" | "community" | "general";
  district: string;
  urgent: boolean;
  timestamp: string;
  locationName: string;
  actionText?: string;
  actionTextEn?: string;
}

export interface PrayerSchedule {
  name: string;
  nameEn: string;
  time: string;
  isNext?: boolean;
  icon: string;
}

export interface Mosque {
  id: string;
  name: string;
  district: string;
  area: string;
  distanceMeters: number;
  jamatTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah?: string;
  };
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  photo: string;
}

export interface TourismSpot {
  id: string;
  name: string;
  nameEn: string;
  district: string;
  category: string;
  rating: number;
  photo: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface SportsGame {
  id: string;
  title: string;
  sport: "ক্রিকেট" | "ফুটবল" | "ব্যাডমিন্টন" | "ভলিবল";
  district: string;
  venue: string;
  date: string;
  time: string;
  joinedCount: number;
  totalNeeded: number;
  organizerName: string;
  organizerAvatar: string;
  latitude: number;
  longitude: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "request" | "message" | "prayer" | "circle" | "alert";
  userAvatar?: string;
}
