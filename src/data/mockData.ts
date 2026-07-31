import {
  UserProfile,
  NearbyUser,
  GlobalUser,
  CirclePost,
  EventAlert,
  Mosque,
  TourismSpot,
  SportsGame,
  AppNotification,
  Conversation
} from "../types";

export const initialCurrentUser: UserProfile = {
  id: "user_me",
  isAdmin: true, // App Owner / Admin
  phone: "+8801712345678", // HIDDEN IN PUBLIC VIEW
  realName: "মোহাম্মদ রাফসান তানভীর",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  dob: "1998-05-15",
  gender: "পুরুষ",
  country: "বাংলাদেশ",
  district: "ঢাকা",
  bio: "প্রযুক্তিপ্রেমী, ভ্রমণপিপাসু ও আড্ডা দিতে ভালোবাসি। চিনা বাদামের মাধ্যমে নতুন মানুষের সাথে পরিচিত হতে পেরে আনন্দিত! 🥜",
  interests: ["ভ্রমণ", "প্রযুক্তি", "ক্রিকেট", "ইসলামিক আলোচনা", "বই পড়া", "চা আড্ডা"],
  isOnline: true,
  friendsCount: 24,
  latitude: 23.7465,
  longitude: 90.3760, // Dhanmondi, Dhaka
  // Earn Wallet initial values
  walletBalance: 125.50,
  todayEarnings: 15.00,
  adsWatchedToday: 3,
  dailyStreakDays: 5,
  withdrawHistory: [
    {
      id: "w_1",
      amount: 100,
      method: "bkash",
      accountNumber: "017****5678",
      status: "completed",
      timestamp: "গতকাল বিকাল ৪:২০",
    },
  ],
};

export const mockNearbyUsers: NearbyUser[] = [
  {
    id: "user_1",
    realName: "তাহমিদ হাসান",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    country: "বাংলাদেশ",
    district: "ঢাকা (ধানমণ্ডি)",
    distanceKm: 0.4,
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "ফটোগ্রাফি ও ফুটবলের অনুরাগী। নতুন নতুন ক্যাফে এক্সপ্লোর করি।",
    interests: ["ফটোগ্রাফি", "ফুটবল", "ক্যাফে", "আড্ডা"],
    latitude: 23.7480,
    longitude: 90.3780,
    isFriend: false,
    requestPending: false,
  },
  {
    id: "user_2",
    realName: "নুসরাত জাহান মিম",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    country: "বাংলাদেশ",
    district: "ঢাকা (মিরপুর)",
    distanceKm: 1.2,
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "বিশ্ববিদ্যালয় শিক্ষার্থী। ইসলামিক সাহিত্য ও বই পড়তে পছন্দ করি।",
    interests: ["ইসলামিক সাহিত্য", "বই পড়া", "রান্না", "ভ্রমণ"],
    latitude: 23.7510,
    longitude: 90.3720,
    isFriend: true,
  },
  {
    id: "user_3",
    realName: "আরিফুল ইসলাম জিশান",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    country: "বাংলাদেশ",
    district: "ঢাকা (উত্তরা)",
    distanceKm: 2.5,
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "ব্যাডমিন্টন খেলোয়াড় ও সফটওয়্যার ডেভেলপার।",
    interests: ["ব্যাডমিন্টন", "প্রযুক্তি", "কোডিং", "চা"],
    latitude: 23.7420,
    longitude: 90.3810,
    isFriend: false,
    requestPending: true,
  },
  {
    id: "user_4",
    realName: "আফরোজা সিদ্দিকা",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    country: "বাংলাদেশ",
    district: "ঢাকা (গুলশান)",
    distanceKm: 3.1,
    isOnline: false,
    lastActive: "৫ মিনিট আগে",
    bio: "ভ্রমণ সংকলক ও আর্ট লাভার। লালবাগ কেল্লা এবং পুরান ঢাকা আমার প্রিয় স্থান।",
    interests: ["আর্ট", "ভ্রমণ", "ঐতিহাসিক স্থান"],
    latitude: 23.7550,
    longitude: 90.3680,
    isFriend: false,
  },
  {
    id: "user_5",
    realName: "তানভীর আহমেদ সাকিব",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250",
    country: "বাংলাদেশ",
    district: "ঢাকা (মোহাম্মদপুর)",
    distanceKm: 1.8,
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "নিয়মিত রক্তদাতা (B+ve)। যে কোনো জরুরি মুহূর্তে সামাজিক কাজে পাশে থাকি।",
    interests: ["রক্তদান", "সমাজসেবা", "ক্রিকেট"],
    latitude: 23.7400,
    longitude: 90.3700,
    isFriend: false,
  }
];

export const mockGlobalUsers: GlobalUser[] = [
  {
    id: "global_1",
    realName: "খন্দকার আব্দুল্লাহ",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250",
    country: "সৌদি আরব",
    city: "রিয়াদ (Riyadh)",
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "সৌদি আরবে অবস্থানরত বাংলাদেশি। দেশি ভাইদের আড্ডায় যুক্ত হতে পছন্দ করি।",
    interests: ["প্রবাস জীবন", "ইসলামিক আলোচনা", "ভ্রমণ"],
    latitude: 24.7136,
    longitude: 46.6753,
    isFriend: false,
  },
  {
    id: "global_2",
    realName: "রেহানা রহমান চৌধুরী",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    country: "যুক্তরাজ্য (UK)",
    city: "লন্ডন (London)",
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "লন্ডনে সেটলড সিলহেটি প্রবাসী। কটেজ আর্ট ও সিলেট কমিউনিটি মেটআপ করি।",
    interests: ["সিলেটী সংস্কৃতির আড্ডা", "ভ্রমণ", "চা"],
    latitude: 51.5074,
    longitude: -0.1278,
    isFriend: false,
  },
  {
    id: "global_3",
    realName: "ফারহান সাজিদ",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
    country: "সংযুক্ত আরব আমিরাত",
    city: "দুবাই (Dubai)",
    isOnline: true,
    lastActive: "এখনই সক্রিয় 🟢",
    bio: "দুবাইতে সিভিল ইঞ্জিনিয়ারিং চাকরি করছি। ছুটির দিনে বন্ধুদের সাথে চা আড্ডা।",
    interests: ["ইঞ্জিনিয়ারিং", "গাড়ি", "আড্ডা"],
    latitude: 25.2048,
    longitude: 55.2708,
    isFriend: false,
  },
  {
    id: "global_4",
    realName: "ফারজানা আখতার রিয়া",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
    country: "যুক্তরাষ্ট্র (USA)",
    city: "নিউ ইয়র্ক (New York)",
    isOnline: false,
    lastActive: "১০ মিনিট আগে",
    bio: "নিউ ইয়র্কে পড়াশোনা করছি। উইকএন্ডে বাঙালি কমিউনিটির প্রোগ্রামে অংশ নিই।",
    interests: ["গবেষণা", "মিউজিক", "আড্ডা"],
    latitude: 40.7128,
    longitude: -74.0060,
    isFriend: false,
  }
];

export const mockCirclePosts: CirclePost[] = [
  {
    id: "post_video_1",
    authorId: "user_me",
    authorName: "মোহাম্মদ রাফসান তানভীর",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    authorDistrict: "ঢাকা",
    category: "ভ্রমণ",
    title: "🎥 বান্দরবানের মেঘলা পর্যটন কেন্দ্রের অপূর্ব প্রাকৃতিক দৃশ্য! (ভিডিও ক্লিপ)",
    content: "গত সপ্তাহে বান্দরবান ভ্রমণের সময় রেকর্ড করা আমাদের ছোট ভিডিও ক্লিপটি চিনা বাদাম সার্কেলের বন্ধুদের সাথে শেয়ার করলাম। পাহাড় ও মেঘের মিলন সত্যিই অপূর্ব!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    likes: 67,
    isLiked: true,
    timestamp: "এখনই",
    locationName: "মেঘলা, বান্দরবান",
    comments: [
      {
        id: "cv1",
        authorName: "তাহমিদ হাসান",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
        text: "ভিডিওর দৃশ্য দারুণ এসেছে ভাই! অসাধারণ বান্দরবান।",
        timestamp: "১ মিনিট আগে"
      }
    ]
  },
  {
    id: "post_1",
    authorId: "user_5",
    authorName: "তানভীর আহমেদ সাকিব",
    authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250",
    authorDistrict: "ঢাকা",
    category: "রক্তদাতা",
    title: "জরুরি O Negative (+) রক্ত প্রয়োজন! ধানমণ্ডি ইবনে সিনা হাসপাতাল",
    content: "আসসালামু আলাইকুম। ধানমণ্ডি ইবনে সিনা হাসপাতালে একজন রোগীর চিকিৎসার জন্য জরুরি ১ ব্যাগ O-ve রক্ত লাগবে। যদি আশেপাশে কেউ থাকেন বা কোনো স্বেচ্ছাসেবী ভাই সাহায্য করতে পারেন, দয়া করে মেসেজ দিন।",
    imageUrl: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600",
    likes: 38,
    isLiked: true,
    timestamp: "১০ মিনিট আগে",
    locationName: "ধানমণ্ডি, ঢাকা",
    comments: [
      {
        id: "c1",
        authorName: "তাহমিদ হাসান",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
        text: "আমি O-ve গ্রুপের লোক ধানমণ্ডিতেই আছি। ইনবক্সে যোগাযোগ করছি।",
        timestamp: "৫ মিনিট আগে"
      },
      {
        id: "c2",
        authorName: "নুসরাত জাহান মিম",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
        text: "শেয়ার করলাম, আল্লাহ রোগীকে আরোগ্য দান করুন।",
        timestamp: "২ মিনিট আগে"
      }
    ]
  },
  {
    id: "post_2",
    authorId: "user_1",
    authorName: "তাহমিদ হাসান",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    authorDistrict: "ঢাকা",
    category: "খেলার আয়োজন",
    title: "আজ সন্ধ্যায় আবাহনী মাঠে ফ্রেন্ডলি ৬ বনাম ৬ ফুটবল ম্যাচ!",
    content: "আজ বিকেল ৫:৩০ টায় ধানমণ্ডি আবাহনী মাঠে আমরা এক ঘণ্টার ফ্রেন্ডলি ফুটবল খেলব। আমাদের ২ জন প্লেয়ার শর্ট আছে। কেউ যোগ দিতে চাইলে কমেন্ট বা ইনবক্স করুন।",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
    likes: 19,
    timestamp: "১ ঘণ্টা আগে",
    locationName: "আবাহনী মাঠ, ধানমণ্ডি",
    comments: [
      {
        id: "c3",
        authorName: "মোহাম্মদ রাফসান",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        text: "আমি আসতে পারব ভাই! বুট রেডি করছি।",
        timestamp: "৪৫ মিনিট আগে"
      }
    ]
  },
  {
    id: "post_3",
    authorId: "user_2",
    authorName: "নুসরাত জাহান মিম",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
    authorDistrict: "ঢাকা",
    category: "মাহফিল",
    title: "আসন্ন পবিত্র শবে কদর উপলক্ষে ধানমণ্ডি বায়তুল আমান মসজিদে বিশেষ মাহফিল",
    content: "ধানমণ্ডি ৭ নম্বর রোডের বায়তুল আমান জামে মসজিদে বাদ এশা কোরআন খতম ও জিকিরের মাহফিল অনুষ্ঠিত হবে। সকল সর্বস্তরের ভাইদের অংশ নেওয়ার দাওয়াত রইল।",
    likes: 54,
    timestamp: "৩ ঘণ্টা আগে",
    locationName: "বায়তুল আমান মসজিদ, ধানমণ্ডি",
    comments: []
  },
  {
    id: "post_4",
    authorId: "user_3",
    authorName: "আরিফুল ইসলাম জিশান",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    authorDistrict: "সিলেট",
    category: "ভ্রমণ",
    title: "আগামী শুক্রবার সিলেট রাতারগুল ও বিছানাকান্দি একদিনের ট্যুর গ্রুপ!",
    content: "আমরা ৫ জন বন্ধু মিলে শুক্রবার সকালে সিলেট শহর থেকে রাতারগুল ও বিছানাকান্দির উদ্দেশ্যে মাইক্রোবাস ভাড়া করেছি। ৩ জন ফিমেল/মেল মেম্বার ব্যাকট ব্যাক অ্যাড হতে পারবেন। খরচ সমান ভাগে ভাগ হবে।",
    imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600",
    likes: 42,
    timestamp: "৫ ঘণ্টা আগে",
    locationName: "সিলেট সদর",
    comments: []
  }
];

export const mockEventAlerts: EventAlert[] = [
  {
    id: "alert_1",
    title: "🚨 জরুরি রক্ত প্রয়োজন! (O-ve)",
    titleEn: "🚨 Emergency Blood Needed! (O-ve)",
    description: "ধানমণ্ডি ইবনে সিনা হাসপাতালে জরুরি ১ ব্যাগ O Negative রক্ত প্রয়োজন। নিকটস্থ রক্তদাতারা দ্রুত যোগাযোগ করুন।",
    type: "blood",
    district: "ঢাকা",
    urgent: true,
    timestamp: "এখনই সক্রিয় 🔴",
    locationName: "ধানমণ্ডি ইবনে সিনা হাসপাতাল",
    actionText: "ইনবক্সে কথা বলুন",
    actionTextEn: "Chat with Donor Coordinator"
  },
  {
    id: "alert_2",
    title: "⚽ ফ্রেন্ডলি ফুটবল ম্যাচ প্লেয়ার প্রয়োজন",
    titleEn: "⚽ Football Players Needed Nearby",
    description: "আজ বিকেল ৫:৩০ টায় আবাহনী মাঠে ২ জন প্লেয়ার দরকার। ফ্রিতে খেলা হবে।",
    type: "sports",
    district: "ঢাকা",
    urgent: false,
    timestamp: "১ ঘণ্টা পর শুরু",
    locationName: "ধানমণ্ডি আবাহনী মাঠ",
    actionText: "খেলায় যোগ দিন",
    actionTextEn: "Join Match"
  },
  {
    id: "alert_3",
    title: "🕌 যোহরের নামাযের বাকি আর ২৫ মিনিট",
    titleEn: "🕌 Dhuhr Prayer in 25 Minutes",
    description: "আপনার নিকটবর্তী ধানমণ্ডি বায়তুল আমান জামে মসজিদে ১:১৫ মিনিটে যোহরের জামাত অনুষ্ঠিত হবে।",
    type: "prayer",
    district: "ঢাকা",
    urgent: false,
    timestamp: "১:১৫ PM",
    locationName: "ধানমণ্ডি বায়তুল আমান মসজিদ",
    actionText: "কিবলা দেখুন",
    actionTextEn: "Show Qibla"
  }
];

export const mockMosques: Mosque[] = [
  {
    id: "m1",
    name: "ধানমণ্ডি বায়তুল আমান জামে মসজিদ",
    district: "ঢাকা",
    area: "ধানমণ্ডি রোড ৭",
    distanceMeters: 320,
    jamatTimes: {
      fajr: "৫:১০ AM",
      dhuhr: "১:১৫ PM",
      asr: "৪:৪৫ PM",
      maghrib: "৬:৫৫ PM",
      isha: "৮:১৫ PM",
      jummah: "১:৩০ PM"
    },
    address: "রোড নম্বর ৭, ধানমণ্ডি আ/এ, ঢাকা",
    rating: 4.9,
    latitude: 23.7460,
    longitude: 90.3770,
    photo: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "m2",
    name: "ধানমণ্ডি রবীন্দ্র সরোবর জামে মসজিদ",
    district: "ঢাকা",
    area: "ধানমণ্ডি ৮/এ",
    distanceMeters: 650,
    jamatTimes: {
      fajr: "৫:১৫ AM",
      dhuhr: "১:১৫ PM",
      asr: "৪:৪৫ PM",
      maghrib: "৬:৫৫ PM",
      isha: "৮:১৫ PM",
      jummah: "১:৩০ PM"
    },
    address: "ধানমণ্ডি লেকের পাড়ে, ৮/এ, ঢাকা",
    rating: 4.8,
    latitude: 23.7490,
    longitude: 90.3740,
    photo: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=500"
  },
  {
    id: "m3",
    name: "সোবহানবাগ জামে মসজিদ",
    district: "ঢাকা",
    area: "মিরপুর রোড, ধানমণ্ডি",
    distanceMeters: 980,
    jamatTimes: {
      fajr: "৫:১০ AM",
      dhuhr: "১:২০ PM",
      asr: "৪:৪৫ PM",
      maghrib: "৬:৫৫ PM",
      isha: "৮:২০ PM",
      jummah: "১:৩০ PM"
    },
    address: "মিরপুর রোড, সোবহানবাগ মোড়, ঢাকা",
    rating: 4.9,
    latitude: 23.7530,
    longitude: 90.3790,
    photo: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=500"
  }
];

export const mockTourismSpots: TourismSpot[] = [
  {
    id: "t1",
    name: "লালবাগ কেল্লা",
    nameEn: "Lalbagh Fort",
    district: "ঢাকা",
    category: "ঐতিহাসিক দুর্গ",
    rating: 4.7,
    photo: "https://images.unsplash.com/photo-1608933220459-b145d58d9241?auto=format&fit=crop&q=80&w=600",
    description: "১৭ শতকের মোঘল আমলের ঐতিহাসিক দুর্গ ও পরিবিবির মাজার। পুরান ঢাকার বুকে এক ঐতিহাসিক নিদর্শন।",
    address: "লালবাগ, পুরান ঢাকা",
    latitude: 23.7188,
    longitude: 90.3882
  },
  {
    id: "t2",
    name: "ধানমণ্ডি লেক ও রবীন্দ্র সরোবর",
    nameEn: "Dhanmondi Lake",
    district: "ঢাকা",
    category: "পার্ক ও লেক",
    rating: 4.6,
    photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    description: "সবুজ গাছপালা ও নির্মল লেকের তীরে বন্ধু ও পরিবারের সাথে সময় কাটানোর সুন্দর জায়গা।",
    address: "ধানমণ্ডি আ/এ, ঢাকা",
    latitude: 23.7470,
    longitude: 90.3750
  },
  {
    id: "t3",
    name: "শ্রীমঙ্গল চা বাগান ও লাউয়াছড়া",
    nameEn: "Sreemangal Tea Gardens",
    district: "মৌলভীবাজার / সিলেট",
    category: "প্রাকৃতিক চা বাগান",
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1597910037310-7dd8ddb93e24?auto=format&fit=crop&q=80&w=600",
    description: "চা এর রাজধানী শ্রীমঙ্গলের মাইলের পর মাইল বিস্তৃত সবুজ চা বাগান ও লাউয়াছড়া জাতীয় উদ্যান।",
    address: "শ্রীমঙ্গল, মৌলভীবাজার",
    latitude: 24.3065,
    longitude: 91.7296
  }
];

export const mockSportsGames: SportsGame[] = [
  {
    id: "sg1",
    title: "ধানমণ্ডি ক্রিকেট লিগ - ফ্রেন্ডলি টি২০",
    sport: "ক্রিকেট",
    district: "ঢাকা",
    venue: "ধানমণ্ডি ৩/এ শেখ জামাল মাঠ",
    date: "আজ",
    time: "বিকেল ৩:৩০ PM",
    joinedCount: 9,
    totalNeeded: 11,
    organizerName: "তাহমিদ হাসান",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    latitude: 23.7430,
    longitude: 90.3760
  },
  {
    id: "sg2",
    title: "নাইট টারফ ফুটবল কাপ ৬vs৬",
    sport: "ফুটবল",
    district: "ঢাকা",
    venue: "মোহাম্মদপুর ফাইভ-আ-সাইড টারফ",
    date: "আজ",
    time: "রাত ৮:০০ PM",
    joinedCount: 5,
    totalNeeded: 6,
    organizerName: "তানভীর আহমেদ সাকিব",
    organizerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250",
    latitude: 23.7500,
    longitude: 90.3660
  }
];

export const mockNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "নতুন ফ্রেন্ড রিকোয়েস্ট 👤",
    message: "তাহমিদ হাসান আপনাকে ফ্রেন্ড রিকোয়েস্ট পাঠিয়েছেন।",
    timestamp: "১০ মিনিট আগে",
    isRead: false,
    type: "request",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "n2",
    title: "নতুন মেসেজ 💬",
    message: "নুসরাত জাহান মিম: 'আসসালামু আলাইকুম, কেমন আছেন?'",
    timestamp: "২৫ মিনিট আগে",
    isRead: false,
    type: "message",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "n3",
    title: "নামাজের সময়সূচী 🕌",
    message: "যোহরের নামাযের আর মাত্র ২০ মিনিট বাকি। ধানমণ্ডি বায়তুল আমান মসজিদ।",
    timestamp: "১ ঘণ্টা আগে",
    isRead: true,
    type: "prayer"
  }
];

export const mockConversations: Conversation[] = [
  {
    id: "group_1",
    peerUser: mockNearbyUsers[0],
    isGroup: true,
    groupName: "☕ ধানমন্ডি চা-আড্ডা গ্রুপ",
    groupAvatar: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=250",
    groupDescription: "ধানমন্ডি এলাকার বন্ধুদের আড্ডা, চা খোর সংঘ ও সাপ্তাহিক দেখা করার গ্রুপ ☕",
    groupMembers: [mockNearbyUsers[0], mockNearbyUsers[1], mockNearbyUsers[2]],
    groupAdminId: "user_me",
    lastMessage: "তাহমিদ: 'আজকে বিকালে ৪ নম্বর রোডের চায়ের দোকানে কারা আসছো?'",
    lastMessageTime: "১:১৫ PM",
    unreadCount: 2,
    isVoiceCallActive: true,
    messages: [
      {
        id: "gm_101",
        senderId: "user_1",
        receiverId: "group_1",
        senderName: "তাহমিদ হাসান",
        senderAvatar: mockNearbyUsers[0].avatar,
        text: "আসসালামু আলাইকুম বন্ধুরা! নতুন গ্রুপ কেমন লাগছে?",
        timestamp: "১২:১৫ PM",
        isRead: true
      },
      {
        id: "gm_102",
        senderId: "user_2",
        receiverId: "group_1",
        senderName: "নুসরাত জাহান মিম",
        senderAvatar: mockNearbyUsers[1].avatar,
        text: "ওয়া আলাইকুমুস সালাম! চিনা বাদামে বন্ধুরা মিলে গ্রুপ খোলার অপশন পেয়ে খুব ভালো লাগছে! 🎉",
        timestamp: "১২:১৮ PM",
        isRead: true
      },
      {
        id: "gm_103",
        senderId: "user_1",
        receiverId: "group_1",
        senderName: "তাহমিদ হাসান",
        senderAvatar: mockNearbyUsers[0].avatar,
        text: "আজকে বিকালে ৪ নম্বর রোডের চায়ের দোকানে কারা আসছো?",
        timestamp: "১:১৫ PM",
        isRead: false
      }
    ]
  },
  {
    id: "conv_1",
    peerUser: mockNearbyUsers[1], // Nusrath
    lastMessage: "আসসালামু আলাইকুম, কেমন আছেন?",
    lastMessageTime: "১২:৪০ PM",
    unreadCount: 1,
    messages: [
      {
        id: "m101",
        senderId: "user_2",
        receiverId: "user_me",
        text: "আসসালামু আলাইকুম, কেমন আছেন?",
        timestamp: "১২:৪০ PM",
        isRead: false
      }
    ]
  },
  {
    id: "conv_2",
    peerUser: mockNearbyUsers[0], // Tahmid
    lastMessage: "ভাই ধানমণ্ডিতে ফুটবল খেলায় আসছেন তো?",
    lastMessageTime: "১১:১৫ AM",
    unreadCount: 0,
    messages: [
      {
        id: "m102",
        senderId: "user_1",
        receiverId: "user_me",
        text: "ভাই ধানমণ্ডিতে ফুটবল খেলায় আসছেন তো?",
        timestamp: "১১:১৫ AM",
        isRead: true
      },
      {
        id: "m103",
        senderId: "user_me",
        receiverId: "user_1",
        text: "ইনশাল্লাহ ভাই, বুট রেডি করে সাড়ে ৫টায় রওনা হব!",
        timestamp: "১১:১৮ AM",
        isRead: true
      }
    ]
  }
];
