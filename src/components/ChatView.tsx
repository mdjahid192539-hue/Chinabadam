import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Mic,
  Smile,
  MapPin,
  Lock,
  ArrowLeft,
  CheckCheck,
  Coffee,
  Palette,
  MessageSquare,
  Users,
  Flame,
  ThumbsUp,
  Heart,
  Gift,
  Clock,
  Zap,
  Sliders,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Eye,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreateGroupModal } from "./CreateGroupModal";
import { PhoneCall, UserPlus, Volume2, MicOff, Radio } from "lucide-react";

interface AddaRoom {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  topic: string;
  activeCount: number;
  bgGradient: string;
  badgeColor: string;
  speakers: { name: string; avatar: string; isSpeaking: boolean }[];
  messages: {
    id: string;
    senderName: string;
    senderAvatar: string;
    district: string;
    text?: string;
    audioUrl?: string;
    giftItem?: { icon: string; title: string; points: number };
    timestamp: string;
  }[];
}

export interface WallpaperItem {
  id: string;
  title: string;
  titleEn: string;
  type: "photo" | "gradient" | "custom";
  url?: string;
  gradientClass?: string;
  isDark?: boolean;
  thumbnail: string;
}

export const ChatView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    currentUser,
    t,
    language,
  } = useApp();

  // Mode: "private" (1-on-1) or "adda_lounge" (Public Topic & Voice Rooms)
  const [chatTab, setChatTab] = useState<"private" | "adda_lounge">("private");

  // Private & Group Chat States
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isGroupVoiceActive, setIsGroupVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(false);

  // WALLPAPER SYSTEM STATES
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [activeWallpaperTab, setActiveWallpaperTab] = useState<"presets" | "upload" | "url" | "gradients">("presets");
  
  // Map of conversationId -> Wallpaper Config
  const [chatWallpapers, setChatWallpapers] = useState<Record<string, {
    wallpaperId: string;
    customUrl?: string;
    overlayOpacity: number; // 0 to 0.8
    isDarkText?: boolean;
  }>>({
    default: { wallpaperId: "tea_stall", overlayOpacity: 0.15 },
  });

  // Custom Image URL / Upload inputs
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [customUploadUrl, setCustomUploadUrl] = useState<string | null>(null);
  const [wallpaperNotice, setWallpaperNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adda Lounge States
  const [activeRoomId, setActiveRoomId] = useState<string>("room_tea");
  const [roomInput, setRoomInput] = useState("");
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; symbol: string; left: number }[]>([]);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Preset Wallpapers List
  const presetWallpapers: WallpaperItem[] = [
    {
      id: "tea_stall",
      title: "☕ গরম মালাই চায়ের দোকান",
      titleEn: "☕ Rustic Tea Stall",
      type: "photo",
      url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "sajek_valley",
      title: "🌲 সাজেক ভ্যালীর পাহাড়ি মেঘ",
      titleEn: "🌲 Sajek Valley Clouds",
      type: "photo",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "coxs_bazar",
      title: "🌊 কক্সবাজার গোধূলির সমুদ্র",
      titleEn: "🌊 Cox's Bazar Sunset Sea",
      type: "photo",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
    {
      id: "rain_window",
      title: "🌧️ বৃষ্টিভেজা মিষ্টি জানালা",
      titleEn: "🌧️ Rainy Window Coziness",
      type: "photo",
      url: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "night_galaxy",
      title: "🌌 নিশি রাতের ছায়াপথ",
      titleEn: "🌌 Starry Galaxy Night",
      type: "photo",
      url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "islamic_geometry",
      title: "🕌 ইসলামী ক্যালিগ্রাফি আর্ট",
      titleEn: "🕌 Islamic Calligraphy Art",
      type: "photo",
      url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "sunset_sky",
      title: "🌇 গোধূলির লাল-কমলা আকাশ",
      titleEn: "🌇 Crimson Sunset Sky",
      type: "photo",
      url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
    {
      id: "village_green",
      title: "🍃 গ্রাম বাংলার সতেজ প্রান্তর",
      titleEn: "🍃 Green Countryside",
      type: "photo",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
    {
      id: "gradient_amber",
      title: "☕ ওয়াার্ম অ্যাম্বার ও টি গ্রেডিয়েন্ট",
      titleEn: "☕ Warm Amber Gradient",
      type: "gradient",
      gradientClass: "bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200",
      thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
    {
      id: "gradient_emerald",
      title: "🍃 সতেজ এমারেল্ড প্রকৃতি",
      titleEn: "🍃 Emerald Mint Gradient",
      type: "gradient",
      gradientClass: "bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
    {
      id: "gradient_indigo",
      title: "🌌 মিডনাইট ইন্ডিগো নাইট",
      titleEn: "🌌 Midnight Indigo Gradient",
      type: "gradient",
      gradientClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white",
      thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300",
      isDark: true,
    },
    {
      id: "gradient_rose",
      title: "🌸 প্যাস্টেল রোজ ও ক্রিম",
      titleEn: "🌸 Pastel Rose Cream",
      type: "gradient",
      gradientClass: "bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50",
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=300",
      isDark: false,
    },
  ];

  // Virtual Gifts
  const peanutGifts = [
    { icon: "🥜", title: "এক থাবা বাদাম", desc: "বন্ধুত্বের উষ্ণ উপহার", points: 5 },
    { icon: "☕", title: "গরম মালাই চা", desc: "বিকেলের চাঙ্গা আমেজ", points: 10 },
    { icon: "🍧", title: "গরম মচমচে জিলপী", desc: "আড্ডার মিষ্টি স্বাদ", points: 15 },
    { icon: "🌺", title: "সতেজ কাঠগোলাপ", desc: "শ্রদ্ধা ও ভালোবাসার প্রতীক", points: 20 },
  ];

  // Adda Rooms
  const [addaRooms, setAddaRooms] = useState<AddaRoom[]>([
    {
      id: "room_tea",
      name: "☕ চা-এর কাপে সন্ধ্যার আড্ডা",
      nameEn: "☕ Evening Tea Adda Corner",
      icon: "☕",
      topic: "হালকা আমেজে এলাকার খবরাখবর, চা আর বন্ধুদের গল্পসল্প",
      activeCount: 18,
      bgGradient: "from-amber-900 via-orange-950 to-slate-900",
      badgeColor: "bg-amber-500 text-slate-950",
      speakers: [
        { name: "তানভীর হাসান", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
        { name: "সাব্বির আহমেদ", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", isSpeaking: false },
      ],
      messages: [
        {
          id: "m1",
          senderName: "তানভীর হাসান",
          senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          district: "ধানমণ্ডি, ঢাকা",
          text: "আসসালামু আলাইকুম সবাইকে! ধানমণ্ডি ৮ এর চা এর দোকানে কে কে আছেন?",
          timestamp: "সন্ধ্যা ৬:১০",
        },
        {
          id: "m2",
          senderName: "সাব্বির আহমেদ",
          senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          district: "মিরপুর, ঢাকা",
          text: "আজকে আবহাওয়াটা খুব সুন্দর! গরম চা আর চিনা বাদামের কম্বিনেশনটা সেরা 👌",
          giftItem: { icon: "🥜", title: "এক থাবা বাদাম", points: 5 },
          timestamp: "সন্ধ্যা ৬:১২",
        },
      ],
    },
    {
      id: "room_sports",
      name: "🏏 খেলার মাঠ ও স্কোর আড্ডা",
      nameEn: "🏏 Sports & Local Match Talk",
      icon: "🏏",
      topic: "ক্রিকেট, ফুটবল ও বিকেলের লোকাল ম্যাচের টিপস এবং স্কোর আপডেট",
      activeCount: 24,
      bgGradient: "from-indigo-900 via-blue-950 to-slate-900",
      badgeColor: "bg-indigo-500 text-white",
      speakers: [
        { name: "রাকিবুল ইসলাম", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
      ],
      messages: [
        {
          id: "m3",
          senderName: "রাকিবুল ইসলাম",
          senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
          district: "উত্তরা, ঢাকা",
          text: "আগামীকাল সকালে আবাহনী মাঠে ক্রিকেট খেলার কেউ আছেন? ২ জন অলরাউন্ডার লাগবে!",
          timestamp: "সন্ধ্যা ৬:১৫",
        },
      ],
    },
    {
      id: "room_islamic",
      name: "🕌 ইসলামী জ্ঞানচর্চা ও প্রশ্নোত্তর",
      nameEn: "🕌 Islamic Knowledge & Q&A",
      icon: "🕌",
      topic: "দৈনন্দিন নামায, কুরআন তিলাওয়াত ও সুন্নাহ ভিত্তিক সুন্দর আলোচনা",
      activeCount: 32,
      bgGradient: "from-emerald-900 via-teal-950 to-slate-900",
      badgeColor: "bg-emerald-500 text-slate-950",
      speakers: [
        { name: "মাহমুদুল হাসান", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200", isSpeaking: false },
      ],
      messages: [
        {
          id: "m4",
          senderName: "মাহমুদুল হাসান",
          senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
          district: "চট্টগ্রাম",
          text: "যোহরের জামাতের সময় হয়ে এসেছে। এলাকার ভাইদের মসজিদে আসার দাওয়াত রইলো।",
          timestamp: "দুপুর ১:০০",
        },
      ],
    },
    {
      id: "room_travel",
      name: "🎒 ভ্রমণ ও ব্যাকপ্যাকার্স লাউঞ্জ",
      nameEn: "🎒 Travel & Hidden Spot Chatter",
      icon: "🎒",
      topic: "নিকটস্থ ও সারা দেশের সুন্দর ট্রাভেল স্পট ও গাইড পরামর্শ",
      activeCount: 15,
      bgGradient: "from-amber-800 via-stone-900 to-slate-900",
      badgeColor: "bg-amber-400 text-slate-950",
      speakers: [
        { name: "নাফিসা রহমান", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", isSpeaking: true },
      ],
      messages: [
        {
          id: "m5",
          senderName: "নাফিসা রহমান",
          senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          district: "সিলেট",
          text: "শ্রীমঙ্গলের চা বাগানে আগামী সপ্তাহে যাওয়ার প্ল্যান করছি। কেউ লোকাল গাইড রেকমেন্ড করতে পারবেন?",
          giftItem: { icon: "☕", title: "গরম মালাই চা", points: 10 },
          timestamp: "বিকাল ৫:৩০",
        },
      ],
    },
  ]);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeAddaRoom = addaRooms.find((r) => r.id === activeRoomId) || addaRooms[0];

  // Helper to get current active conversation wallpaper config
  const currentConvKey = activeConversationId || "default";
  const currentWpConfig = chatWallpapers[currentConvKey] || chatWallpapers["default"] || {
    wallpaperId: "tea_stall",
    overlayOpacity: 0.15,
  };

  const currentWallpaperItem = presetWallpapers.find((w) => w.id === currentWpConfig.wallpaperId);

  // Quick Dialogues
  const quickPhrases = [
    "কী খবর ভাই? চা খাইছেন? ☕",
    "এক থাবা চিনা বাদাম লন! 🥜",
    "আজকে বিকেলে কোথায় আড্ডায় বসবেন? ☕",
    "আজকের নামাযের সময় কখন? 🕌",
    "সন্ধ্যায় খেলাধুলার প্ল্যান আছে? ⚽",
    "ধন্যবাদ ভাই, শুভকামনা রইলো! 🙏",
    "আজকে আবহাওয়া খুব সুন্দর! 🌤️",
    "আরে ভাই ভাই ভাই! 😂",
  ];

  // WALLPAPER HANDLERS
  const handleSelectPresetWallpaper = (item: WallpaperItem) => {
    setChatWallpapers((prev) => ({
      ...prev,
      [currentConvKey]: {
        wallpaperId: item.id,
        customUrl: undefined,
        overlayOpacity: currentWpConfig.overlayOpacity,
        isDarkText: !item.isDark,
      },
    }));
    triggerNotice(`" ${item.title} " ওয়ালপেপার সেট করা হয়েছে! ✨`);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setChatWallpapers((prev) => ({
      ...prev,
      [currentConvKey]: {
        wallpaperId: "custom_url",
        customUrl: customUrlInput.trim(),
        overlayOpacity: currentWpConfig.overlayOpacity,
      },
    }));
    triggerNotice("লিংক থেকে কাস্টম ওয়ালপেপার সেট করা হয়েছে! 🖼️");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomUploadUrl(dataUrl);
        setChatWallpapers((prev) => ({
          ...prev,
          [currentConvKey]: {
            wallpaperId: "custom_file",
            customUrl: dataUrl,
            overlayOpacity: currentWpConfig.overlayOpacity,
          },
        }));
        triggerNotice("গ্যালারি থেকে আপনার ছবি ওয়ালপেপার হিসেবে সেট হয়েছে! 📸");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOverlayOpacityChange = (opacity: number) => {
    setChatWallpapers((prev) => ({
      ...prev,
      [currentConvKey]: {
        ...currentWpConfig,
        overlayOpacity: opacity,
      },
    }));
  };

  const handleApplyToAllChats = () => {
    const configToApply = { ...currentWpConfig };
    const newMap: Record<string, typeof configToApply> = { default: configToApply };
    conversations.forEach((c) => {
      newMap[c.id] = { ...configToApply };
    });
    setChatWallpapers(newMap);
    triggerNotice("সব চ্যাটে এই ওয়ালপেপার প্রয়োগ করা হয়েছে! 🌐");
  };

  const handleResetWallpaper = () => {
    setChatWallpapers((prev) => {
      const copy = { ...prev };
      delete copy[currentConvKey];
      return copy;
    });
    triggerNotice("ডিফল্ট ওয়ালপেপারে রিসেট করা হয়েছে। 🔄");
  };

  const triggerNotice = (msg: string) => {
    setWallpaperNotice(msg);
    setTimeout(() => {
      setWallpaperNotice(null);
    }, 3000);
  };

  const handleSendPrivate = () => {
    if (!inputMsg.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputMsg.trim());
    setInputMsg("");
  };

  const handleSendGift = (gift: { icon: string; title: string; points: number }) => {
    if (!activeConv) return;
    sendMessage(
      activeConv.id,
      `🎁 [উপহার] ${gift.icon} ${gift.title} পাঠিয়েছেন! (+${gift.points} পয়েন্ট)`
    );
    setShowGiftModal(false);
  };

  const handleSendMockImage = () => {
    if (!activeConv) return;
    const sampleImages = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600"
    ];
    const randomPic = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    sendMessage(activeConv.id, undefined, randomPic);
  };

  const handleSendVoiceNote = () => {
    if (!activeConv) return;
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      sendMessage(activeConv.id, undefined, undefined, "mock_audio_note.mp3");
    }, 1500);
  };

  const handleSendAddaRoomMessage = (gift?: { icon: string; title: string; points: number }) => {
    if (!roomInput.trim() && !gift) return;

    setAddaRooms((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoomId) return r;
        return {
          ...r,
          messages: [
            ...r.messages,
            {
              id: `rm_${Date.now()}`,
              senderName: currentUser.realName,
              senderAvatar: currentUser.avatar,
              district: currentUser.district,
              text: roomInput.trim() ? roomInput.trim() : undefined,
              giftItem: gift,
              timestamp: "এখনই",
            },
          ],
        };
      })
    );

    setRoomInput("");
  };

  const toggleSpeakerHand = () => {
    setIsSpeakerOn(!isSpeakerOn);
    setAddaRooms((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoomId) return r;
        const exists = r.speakers.some((s) => s.name === currentUser.realName);
        if (exists) {
          return {
            ...r,
            speakers: r.speakers.filter((s) => s.name !== currentUser.realName),
          };
        } else {
          return {
            ...r,
            speakers: [
              ...r.speakers,
              { name: currentUser.realName, avatar: currentUser.avatar, isSpeaking: true },
            ],
          };
        }
      })
    );
  };

  const triggerFloatingEmoji = (symbol: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      symbol,
      left: Math.floor(Math.random() * 70) + 15,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2000);
  };

  const sampleEmojis = ["😊", "❤️", "👍", "🥜", "🕌", "⚽", "☕", "🇧🇩", "🔥", "🙏"];

  // Helper to compute active background style for message panel
  const getWallpaperBackgroundStyle = () => {
    if (isStealthMode) {
      return { backgroundColor: "#0f172a", color: "#f8fafc" };
    }

    if (currentWpConfig.customUrl) {
      return {
        backgroundImage: `url('${currentWpConfig.customUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    if (currentWallpaperItem) {
      if (currentWallpaperItem.type === "photo" && currentWallpaperItem.url) {
        return {
          backgroundImage: `url('${currentWallpaperItem.url}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      }
    }

    // Default photo if nothing matches
    return {
      backgroundImage: `url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1200')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  const isGradientType = currentWallpaperItem?.type === "gradient";

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8.5rem)] min-h-[580px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
      
      {/* Toast Notification Banner for Wallpaper Changes */}
      <AnimatePresence>
        {wallpaperNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-amber-300 font-extrabold text-xs px-4 py-2 rounded-2xl border border-amber-400/40 shadow-2xl flex items-center gap-2 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{wallpaperNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Main Mode Selector Header */}
      <div className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
            💬
          </div>
          <div>
            <h2 className="font-black text-sm text-white flex items-center gap-2">
              <span>{language === "bn" ? "কথাবার্তা ও আড্ডাকক্ষ" : "Adda & Conversation Zone"}</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                ইউনিক ২-ইন-১
              </span>
            </h2>
            <p className="text-[10px] text-slate-300 font-medium hidden sm:block">
              {language === "bn" ? "১-অন-১ গোপন চ্যাট এবং লাইভ পাবলিক বিষয়ভিত্তিক আড্ডা ঘর" : "Private chats & live topic lounges"}
            </p>
          </div>
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setChatTab("private")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              chatTab === "private"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === "bn" ? "প্রাইভেট চ্যাট" : "Private Chat"}</span>
          </button>

          <button
            onClick={() => setChatTab("adda_lounge")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              chatTab === "adda_lounge"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-amber-950" />
            <span>{language === "bn" ? "বাদাম আড্ডা ঘর ☕" : "Adda Lounge"}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: PRIVATE CHAT */}
      {chatTab === "private" && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Sidebar: Private Conversations List */}
          <div
            className={`md:col-span-4 border-r border-slate-200 bg-slate-50 flex flex-col h-full ${
              activeConversationId ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-3.5 border-b border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === "bn" ? "চ্যাট ও গ্রুপ আড্ডা" : "Chats & Groups"}</span>
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  {conversations.length} {language === "bn" ? "টি কথোপকথন" : "active"}
                </span>
              </div>

              {/* Create Group Button */}
              <button
                onClick={() => setIsCreateGroupOpen(true)}
                className="w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs py-2 px-3 rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Users className="w-4 h-4 text-amber-300" />
                <span>{language === "bn" ? "➕ বন্ধুদের গ্রুপ তৈরি করুন" : "➕ Create Friends Group"}</span>
              </button>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
              {conversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const isGroup = conv.isGroup;
                const title = isGroup ? conv.groupName : conv.peerUser.realName;
                const avatar = isGroup ? conv.groupAvatar : conv.peerUser.avatar;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                      isSelected ? "bg-blue-50/90 border-l-4 border-blue-700" : "hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={avatar}
                        alt={title}
                        className={`w-11 h-11 object-cover border shadow-2xs ${
                          isGroup ? "rounded-2xl border-indigo-400 ring-2 ring-indigo-200" : "rounded-2xl border-slate-300"
                        }`}
                      />
                      {!isGroup && conv.peerUser.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                      {isGroup && (
                        <span className="absolute -bottom-1 -right-1 bg-purple-700 text-white p-0.5 rounded-full text-[8px] shadow-xs">
                          👥
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                          <span className="truncate">{title}</span>
                          {isGroup && (
                            <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.2 rounded-full shrink-0">
                              গ্রুপ
                            </span>
                          )}
                        </h4>
                        <span className="text-[9px] font-medium text-slate-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-700 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Workspace for Selected Conversation */}
          <div
            className={`md:col-span-8 flex flex-col h-full relative ${
              !activeConversationId ? "hidden md:flex" : "flex"
            }`}
          >
            {activeConv ? (
              <>
                {/* Chat Top Header */}
                <div className="bg-white/95 backdrop-blur-md p-2.5 border-b border-slate-200 flex items-center justify-between shadow-2xs z-10">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setActiveConversationId(null)}
                      className="md:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <img
                        src={activeConv.isGroup ? activeConv.groupAvatar : activeConv.peerUser.avatar}
                        alt={activeConv.isGroup ? activeConv.groupName : activeConv.peerUser.realName}
                        className={`w-10 h-10 object-cover border ${
                          activeConv.isGroup ? "rounded-2xl border-indigo-500 ring-2 ring-indigo-200" : "rounded-xl border-blue-600"
                        }`}
                      />
                      {!activeConv.isGroup && activeConv.peerUser.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                      {activeConv.isGroup && (
                        <span className="absolute -bottom-1 -right-1 bg-purple-700 text-white text-[8px] px-1 rounded-full shadow-xs">
                          👥
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <span>{activeConv.isGroup ? activeConv.groupName : activeConv.peerUser.realName}</span>
                        {activeConv.isGroup ? (
                          <span className="text-[10px] text-purple-800 bg-purple-100 font-extrabold px-2 py-0.2 rounded-full border border-purple-200">
                            {(activeConv.groupMembers?.length || 1) + 1} জন সদস্য
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.2 rounded-full border border-emerald-200">
                            {activeConv.peerUser.district || (activeConv.peerUser as any).city}
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                        {activeConv.isGroup
                          ? (activeConv.groupDescription || "বন্ধুদের গ্রুপ আড্ডা ☕")
                          : `🔒 ${t("phoneHidden")}`}
                      </p>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Live Voice Call Toggle Button for Group Chats ("কথা বলার পাশাপাশি") */}
                    {activeConv.isGroup && (
                      <button
                        onClick={() => setIsGroupVoiceActive(!isGroupVoiceActive)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition flex items-center gap-1.5 border shadow-xs ${
                          isGroupVoiceActive
                            ? "bg-emerald-600 text-white border-emerald-500 animate-pulse"
                            : "bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-800"
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isGroupVoiceActive ? "লাইভ ভয়েস চালু 🟢" : "ভয়েস কল শুরু 🎙️"}</span>
                      </button>
                    )}

                    {/* Stealth Disappearing Toggle */}
                    <button
                      onClick={() => setIsStealthMode(!isStealthMode)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition flex items-center gap-1 border ${
                        isStealthMode
                          ? "bg-purple-900 text-purple-200 border-purple-500 animate-pulse"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title="Disappearing messages mode"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isStealthMode ? "২৪ঘণ্টায় গায়েবী" : "সাধারণ চ্যাট"}</span>
                    </button>

                    {/* WALLPAPER SETTINGS BUTTON */}
                    <button
                      onClick={() => setShowWallpaperModal(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition flex items-center gap-1.5 border border-amber-400/50"
                    >
                      <Palette className="w-3.5 h-3.5 text-slate-950" />
                      <span>{language === "bn" ? "ওয়ালপেপার" : "Wallpaper"}</span>
                    </button>
                  </div>
                </div>

                {/* Live Group Voice Call Overlay Bar (when active) */}
                {activeConv.isGroup && isGroupVoiceActive && (
                  <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-2.5 px-4 border-b border-emerald-700/60 flex items-center justify-between shrink-0 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/40">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        <span className="text-[11px] font-black text-emerald-300">
                          লাইভ গ্রুপ আড্ডা কল চলছে
                        </span>
                      </div>

                      {/* Animated Audio Waveforms */}
                      <div className="hidden sm:flex items-center gap-1">
                        <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                        <span className="text-[10px] text-emerald-200 font-bold ml-1">
                          ৩ জন বন্ধু লাইভে যুক্ত আছেন 🎙️
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                          isMuted ? "bg-red-600 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span className="hidden sm:inline">{isMuted ? "আনমিউট" : "মিউট"}</span>
                      </button>

                      <button
                        onClick={() => setIsGroupVoiceActive(false)}
                        className="bg-red-700 hover:bg-red-800 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs transition"
                      >
                        কল ত্যাগ করুন
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Wallpaper Preset Strip (1-Click Swap Bar) */}
                <div className="bg-slate-900/90 text-white px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[10px] gap-2 shrink-0 overflow-x-auto no-scrollbar">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>ওয়ালপেপার স্ট্রিপ:</span>
                  </span>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    {presetWallpapers.slice(0, 7).map((wp) => {
                      const isActive = currentWpConfig.wallpaperId === wp.id;
                      return (
                        <button
                          key={wp.id}
                          onClick={() => handleSelectPresetWallpaper(wp)}
                          className={`px-2 py-0.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 border ${
                            isActive
                              ? "bg-amber-400 text-slate-950 border-amber-300 shadow-2xs font-extrabold scale-105"
                              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                          }`}
                        >
                          <span className="truncate max-w-[100px]">{wp.title}</span>
                          {isActive && <Check className="w-2.5 h-2.5" />}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setShowWallpaperModal(true)}
                    className="text-amber-400 hover:underline font-extrabold shrink-0 ml-1 text-[10px] flex items-center gap-0.5"
                  >
                    <span>আরও...</span>
                  </button>
                </div>

                {/* Privacy Banner */}
                <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-1.5 text-center text-[10px] font-medium flex items-center justify-center gap-1.5 shadow-inner">
                  <Lock className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>
                    {language === "bn"
                      ? "🔒 সম্পূর্ণ গোপন চ্যাট: আপনার ফোন নম্বর বা প্রকৃত তথ্য সুরক্ষিত।"
                      : "🔒 Strictly confidential chat: Phone number & info are safe."}
                  </span>
                </div>

                {/* MESSAGES FEED CONTAINER WITH DYNAMIC WALLPAPER & DIM OVERLAY */}
                <div
                  className={`flex-1 overflow-y-auto p-4 space-y-3 relative transition-all duration-300 ${
                    isGradientType && currentWallpaperItem?.gradientClass ? currentWallpaperItem.gradientClass : ""
                  }`}
                  style={!isGradientType ? getWallpaperBackgroundStyle() : {}}
                >
                  {/* Darkening Overlay for Readable Messages */}
                  <div
                    className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity duration-300"
                    style={{ opacity: currentWpConfig.overlayOpacity }}
                  />

                  {/* Feed Content */}
                  <div className="relative z-10 space-y-3">
                    {activeConv.messages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 shadow-md backdrop-blur-xs transition ${
                              isMe
                                ? "bg-blue-600/95 text-white rounded-br-none border border-blue-400/30"
                                : "bg-slate-900/85 text-white border border-slate-700/80 rounded-bl-none"
                            }`}
                          >
                            {msg.text && (
                              <p className="text-xs leading-relaxed font-medium">
                                {msg.text}
                              </p>
                            )}

                            {msg.imageUrl && (
                              <img
                                src={msg.imageUrl}
                                alt="Sent attachment"
                                className="rounded-xl mt-1 max-h-48 object-cover border border-white/20"
                              />
                            )}

                            {msg.audioUrl && (
                              <div className="flex items-center gap-2 bg-black/25 p-2 rounded-xl mt-1 border border-white/10">
                                <Mic className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                                <div className="flex-1">
                                  <span className="text-[11px] font-bold block text-amber-200">
                                    {language === "bn" ? "ভয়েস মেসেজ (0:12)" : "Voice Message (0:12)"}
                                  </span>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-2 bg-amber-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="text-[9px] text-amber-200 font-mono ml-2">অডিও নোট</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div
                              className={`text-[9px] mt-1 text-right font-semibold ${
                                isMe ? "text-blue-100" : "text-slate-300"
                              }`}
                            >
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recording Feedback Banner */}
                {isRecordingVoice && (
                  <div className="bg-amber-500 text-white p-2 text-center text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                    <Mic className="w-4 h-4" />
                    <span>{language === "bn" ? "ভয়েস মেসেজ রেকর্ড হচ্ছে..." : "Recording voice message..."}</span>
                  </div>
                )}

                {/* Gift Selection Overlay Modal */}
                {showGiftModal && (
                  <div className="bg-amber-950/95 text-white p-3 border-t border-amber-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider shrink-0">
                      🎁 উপহার দিন:
                    </span>
                    {peanutGifts.map((g) => (
                      <button
                        key={g.title}
                        onClick={() => handleSendGift(g)}
                        className="bg-amber-900/80 hover:bg-amber-800 text-white border border-amber-700/80 rounded-2xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
                      >
                        <span className="text-base">{g.icon}</span>
                        <span>{g.title}</span>
                        <span className="text-[9px] text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded-full">
                          +{g.points}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Dialogue Chips */}
                {showQuickPhrases && (
                  <div className="bg-white/95 backdrop-blur-xs border-t border-slate-200 p-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-extrabold text-blue-900 bg-blue-50 px-2 py-1 rounded-xl shrink-0">
                      চটজলদি আড্ডা:
                    </span>
                    {quickPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMsg(phrase);
                          setShowQuickPhrases(false);
                        }}
                        className="bg-slate-100 hover:bg-blue-100 hover:text-blue-900 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap border border-slate-200 transition shrink-0"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                )}

                {/* Emoji Quick Picker */}
                {showEmojiPicker && (
                  <div className="bg-white border-t border-slate-200 p-2 flex items-center justify-center gap-2 flex-wrap">
                    {sampleEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setInputMsg((prev) => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl hover:scale-125 transition p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Bar */}
                <div className="bg-white p-2.5 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => setShowGiftModal(!showGiftModal)}
                    className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition font-black text-xs"
                    title="Send Peanut Gift"
                  >
                    🎁
                  </button>

                  <button
                    onClick={() => setShowQuickPhrases(!showQuickPhrases)}
                    className="p-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition font-extrabold text-xs"
                    title="Quick Dialogue"
                  >
                    💬
                  </button>

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-slate-500 hover:text-amber-500 hover:bg-slate-100 rounded-xl transition"
                    title="Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSendMockImage}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
                    title="Image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSendVoiceNote}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition"
                    title="Voice Note"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPrivate()}
                    placeholder={language === "bn" ? "প্রাইভেট মেসেজ লিখুন..." : "Type a confidential message..."}
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-blue-600 focus:bg-white"
                  />

                  <button
                    onClick={handleSendPrivate}
                    disabled={!inputMsg.trim()}
                    className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white p-2.5 rounded-2xl shadow-xs transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <ShieldCheck className="w-12 h-12 text-blue-600 mb-2" />
                <h3 className="font-extrabold text-base text-slate-800">
                  {language === "bn" ? "কোনো প্রাইভেট চ্যাট সিলেক্ট করা হয়নি" : "No Chat Selected"}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {t("noPhoneTrace")}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODE 2: CHINABADAM ADDA LOUNGE (Public Topic & Audio Rooms) */}
      {chatTab === "adda_lounge" && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-900 relative">
          
          {/* Floating Emoji Animation Canvas Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            <AnimatePresence>
              {floatingEmojis.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 1, y: "80vh", scale: 0.8 }}
                  animate={{ opacity: 0, y: "10vh", scale: 1.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                  style={{ left: `${e.left}%` }}
                  className="absolute text-3xl font-black drop-shadow-md"
                >
                  {e.symbol}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Left Column: Room Selector */}
          <div className="md:col-span-4 border-r border-slate-800 bg-slate-950/80 p-3 flex flex-col h-full overflow-y-auto space-y-2.5">
            <div className="pb-2 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                🎙️ চিনা বাদাম আড্ডাকক্ষ
              </span>
              <h3 className="font-extrabold text-sm text-white mt-0.5">
                {language === "bn" ? "লাইভ বিষয়ভিত্তিক আড্ডা ঘর" : "Live Public Adda Rooms"}
              </h3>
            </div>

            {addaRooms.map((room) => {
              const isSelected = room.id === activeRoomId;
              return (
                <div
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`p-3 rounded-2xl cursor-pointer border transition ${
                    isSelected
                      ? "bg-slate-800 border-amber-400 shadow-md"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{room.icon}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${room.badgeColor}`}>
                      👥 {room.activeCount} জন আড্ডায়
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-white mt-2">
                    {language === "bn" ? room.name : room.nameEn}
                  </h4>

                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {room.topic}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Adda Room Feed & Voice Pod */}
          <div className="md:col-span-8 flex flex-col h-full bg-slate-900/90 relative">
            
            {/* Room Banner */}
            <div className={`p-3.5 bg-gradient-to-r ${activeAddaRoom.bgGradient} border-b border-slate-800 text-white flex items-center justify-between shadow-md shrink-0`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeAddaRoom.icon}</span>
                  <h3 className="font-black text-base text-white">
                    {language === "bn" ? activeAddaRoom.name : activeAddaRoom.nameEn}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {activeAddaRoom.topic}
                </p>
              </div>

              {/* Reaction Launcher Buttons */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
                <span className="text-[9px] font-bold text-amber-300 px-1 hidden sm:inline">
                  রিয়্যাকশন ছুড়ুন:
                </span>
                {["☕", "🥜", "🏏", "🔥", "❤️"].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => triggerFloatingEmoji(sym)}
                    className="p-1.5 hover:scale-125 transition text-base active:scale-90"
                    title="Send Reaction"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE VOICE POD (লাইভ ভয়েস মাইক ও স্পিকার স্ট্রিম) */}
            <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping shrink-0"></div>
                <span className="text-xs font-black text-amber-300 shrink-0">
                  🎙️ অন-এয়ার স্পিকারস:
                </span>
                
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  {activeAddaRoom.speakers.map((spk, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-xl border border-slate-700 shrink-0">
                      <div className="relative">
                        <img src={spk.avatar} alt={spk.name} className="w-5 h-5 rounded-full object-cover" />
                        {spk.isSpeaking && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200">{spk.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speak / Mic Toggle Button */}
              <button
                onClick={toggleSpeakerHand}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                  isSpeakerOn
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-amber-400 text-slate-950 hover:bg-amber-300"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isSpeakerOn ? "কথা বলছেন (মাইক অন)" : "মাইক নিন (কথা বলুন)"}</span>
              </button>
            </div>

            {/* Room Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeAddaRoom.messages.map((m) => (
                <div key={m.id} className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={m.senderAvatar}
                        alt={m.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <div>
                        <span className="font-extrabold text-xs text-amber-300 block">
                          {m.senderName}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          📍 {m.district}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-slate-400">
                      {m.timestamp}
                    </span>
                  </div>

                  {m.text && (
                    <p className="text-xs text-slate-200 mt-2 font-medium leading-relaxed">
                      {m.text}
                    </p>
                  )}

                  {m.giftItem && (
                    <div className="bg-gradient-to-r from-amber-950 to-orange-950 p-2.5 rounded-xl border border-amber-600/50 mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.giftItem.icon}</span>
                        <div>
                          <span className="text-xs font-black text-amber-300 block">
                            {m.giftItem.title} উপহার পাঠিয়েছেন!
                          </span>
                          <span className="text-[10px] text-amber-100">
                            আড্ডার মিষ্টি শুভেচ্ছা
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                        +{m.giftItem.points} পয়েন্ট
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Adda Room Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => handleSendAddaRoomMessage({ icon: "🥜", title: "এক থাবা বাদাম", points: 5 })}
                className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-2xl border border-amber-500/40 text-xs font-black transition shrink-0"
                title="Send Peanuts"
              >
                🥜 বাদাম দিন
              </button>

              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAddaRoomMessage()}
                placeholder={
                  language === "bn"
                    ? `${activeAddaRoom.name}-এ আড্ডার বার্তা লিখুন...`
                    : `Send a note in ${activeAddaRoom.nameEn}...`
                }
                className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-2xl px-4 py-2.5 text-xs font-medium focus:outline-amber-400"
              />

              <button
                onClick={() => handleSendAddaRoomMessage()}
                disabled={!roomInput.trim()}
                className="bg-amber-400 hover:bg-amber-500 disabled:bg-slate-700 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-sm transition text-xs shrink-0"
              >
                আড্ডায় বলুন
              </button>
            </div>

          </div>

        </div>
      )}

      {/* WALLPAPER CUSTOMIZATION MODAL (চ্যাট ওয়ালপেপার সেটিংস প্যানেল) */}
      <AnimatePresence>
        {showWallpaperModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-sm">
                    🖼️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <span>{language === "bn" ? "চ্যাট ওয়ালপেপার ম্যানেজার" : "Chat Wallpaper Manager"}</span>
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                        এইচডি ওয়ালপেপার
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {language === "bn"
                        ? "আপনার পছন্দমতো ছবি, আপলোডকৃত ফটো বা কালার ব্যাকগ্রাউন্ড সেট করুন"
                        : "Customize chat theme with HD presets, custom photos or gradients"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWallpaperModal(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wallpaper Category Tabs */}
              <div className="flex items-center gap-2 my-3 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800/80">
                <button
                  onClick={() => setActiveWallpaperTab("presets")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                    activeWallpaperTab === "presets"
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === "bn" ? "রেডি এইচডি ছবি (Presets)" : "HD Presets"}</span>
                </button>

                <button
                  onClick={() => setActiveWallpaperTab("upload")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                    activeWallpaperTab === "upload"
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{language === "bn" ? "নিজের গ্যালারি থেকে" : "Upload Photo"}</span>
                </button>

                <button
                  onClick={() => setActiveWallpaperTab("url")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                    activeWallpaperTab === "url"
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{language === "bn" ? "ওয়েব ফটো লিংক (URL)" : "Image Link"}</span>
                </button>

                <button
                  onClick={() => setActiveWallpaperTab("gradients")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                    activeWallpaperTab === "gradients"
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>{language === "bn" ? "গ্রেডিয়েন্ট কালার" : "Gradients"}</span>
                </button>
              </div>

              {/* TAB CONTENT AREA */}
              <div className="flex-1 overflow-y-auto pr-1 my-2 space-y-4">
                
                {/* PRESETS TAB */}
                {activeWallpaperTab === "presets" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {presetWallpapers.filter(w => w.type === "photo").map((item) => {
                      const isSelected = currentWpConfig.wallpaperId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectPresetWallpaper(item)}
                          className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition h-28 flex flex-col justify-end p-2.5 ${
                            isSelected
                              ? "border-amber-400 ring-2 ring-amber-400/50 scale-102"
                              : "border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 rounded-full p-1 font-black shadow-md">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <span className="relative z-10 font-black text-xs text-amber-200 drop-shadow-md truncate">
                            {language === "bn" ? item.title : item.titleEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* UPLOAD FROM DEVICE TAB */}
                {activeWallpaperTab === "upload" && (
                  <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-3xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-2xl">
                      📸
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {language === "bn" ? "নিজের কম্পিউটার বা ফোন থেকে ফটো নির্বাচন করুন" : "Choose a photo from your device"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        {language === "bn"
                          ? "আপনার গ্যালারি থেকে যেকোনো পছন্দের ছবি আপলোড করে মুহূর্তেই চ্যাট ব্যাকগ্রাউন্ড বানান।"
                          : "Upload any custom picture from your photos gallery."}
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 text-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{language === "bn" ? "ছবি আপলোড করুন (Upload Photo)" : "Browse File"}</span>
                    </button>

                    {customUploadUrl && (
                      <div className="mt-3 p-2 bg-slate-900 rounded-xl border border-amber-400/40 flex items-center gap-2">
                        <img src={customUploadUrl} alt="Custom Preview" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-xs text-amber-300 font-bold">কাস্টম ছবি ওয়ালপেপার হিসেবে কার্যকর!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* IMAGE URL TAB */}
                {activeWallpaperTab === "url" && (
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
                    <h4 className="font-extrabold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4" />
                      <span>{language === "bn" ? "অনলাইন ছবির ওয়েব লিংক দিন" : "Paste Image URL"}</span>
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://example.com/my-wallpaper.jpg"
                        className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-2xl px-3.5 py-2.5 text-xs focus:outline-amber-400"
                      />

                      <button
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrlInput.trim()}
                        className="bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-sm text-xs transition shrink-0"
                      >
                        {language === "bn" ? "সেট করুন" : "Set"}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      💡 টিপস: Unsplash বা যেকোনো পিকচার ওয়েবসাইটের ছবির ডাইরেক্ট লিংক পেস্ট করতে পারেন।
                    </p>
                  </div>
                )}

                {/* GRADIENTS TAB */}
                {activeWallpaperTab === "gradients" && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    {presetWallpapers.filter(w => w.type === "gradient").map((item) => {
                      const isSelected = currentWpConfig.wallpaperId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectPresetWallpaper(item)}
                          className={`rounded-2xl p-4 cursor-pointer border-2 transition h-20 flex items-center justify-between shadow-md ${
                            item.gradientClass
                          } ${
                            isSelected
                              ? "border-amber-400 ring-2 ring-amber-400/50 scale-102"
                              : "border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          <span className="font-extrabold text-xs text-slate-900 drop-shadow-2xs">
                            {language === "bn" ? item.title : item.titleEn}
                          </span>

                          {isSelected && (
                            <div className="bg-amber-400 text-slate-950 rounded-full p-1 font-black shadow-md">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* OVERLAY DARKNESS / READABILITY ADJUSTMENT SLIDER */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      <span>{language === "bn" ? "মেসেজ স্পষ্টতার জন্য ব্যাকগ্রাউন্ড ডার্কনেস" : "Background Darkening (Readability)"}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {Math.round(currentWpConfig.overlayOpacity * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={currentWpConfig.overlayOpacity}
                    onChange={(e) => handleOverlayOpacityChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>উজ্জ্বল ছবির লুক (0%)</span>
                    <span>মাঝারি ডার্ক (40%)</span>
                    <span>গভীর ডার্ক (80%)</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  onClick={handleResetWallpaper}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "ডিফল্ট রিসেট" : "Reset Default"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToAllChats}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/80 transition flex items-center gap-1.5"
                  >
                    <span>{language === "bn" ? "সকল চ্যাটে প্রয়োগ করুন" : "Apply to All Chats"}</span>
                  </button>

                  <button
                    onClick={() => setShowWallpaperModal(false)}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition"
                  >
                    {language === "bn" ? "সম্পন্ন (Done)" : "Done"}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

    </div>
  );
};
