import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import {
  MessageSquare,
  Heart,
  Share2,
  PlusCircle,
  MapPin,
  Image as ImageIcon,
  Video,
  X,
  Send,
  Film,
  UploadCloud,
  CheckCircle2,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CircleCategory, CirclePost } from "../types";

export const ChinabadamCircle: React.FC = () => {
  const {
    circlePosts,
    addCirclePost,
    likePost,
    addComment,
    currentUser,
    t,
    language,
  } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>("সকল জেলা");
  const [selectedCategory, setSelectedCategory] = useState<string>("সব");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Post Form State
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<CircleCategory>("স্থানীয় আলোচনা");
  const [postDistrict, setPostDistrict] = useState(currentUser.district || "ঢাকা");
  const [postLocationName, setPostLocationName] = useState("ধানমণ্ডি, ঢাকা");
  const [postImage, setPostImage] = useState("");
  const [postVideo, setPostVideo] = useState("");
  const [activeTabMedia, setActiveTabMedia] = useState<"image" | "video">("image");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const sampleVideoClips = [
    {
      name: "প্রকৃতি ও ভ্রমণ",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      name: "খেলাধুলা",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      name: "শর্ট ক্লিপ",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ];

  const districtsList = [
    "সকল জেলা",
    "ঢাকা",
    "চট্টগ্রাম",
    "সিলেট",
    "রাজশাহী",
    "খুলনা",
    "বরিশাল",
    "রংপুর",
    "ময়মনসিংহ",
    "কুমিল্লা",
    "রিয়াদ (সৌদি আরব)",
    "লন্ডন (যুক্তরাজ্য)"
  ];

  const categoryList = [
    "সব",
    "মাহফিল",
    "খেলার আয়োজন",
    "ভ্রমণ",
    "রক্তদাতা",
    "চাকরির খবর",
    "স্থানীয় আলোচনা"
  ];

  const filteredPosts = circlePosts.filter((post) => {
    const matchesDistrict =
      selectedDistrict === "সকল জেলা" || post.authorDistrict === selectedDistrict;
    const matchesCategory =
      selectedCategory === "সব" || post.category === selectedCategory;
    return matchesDistrict && matchesCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addCirclePost({
      authorDistrict: postDistrict,
      category: postCategory,
      title: postTitle,
      content: postContent,
      imageUrl: postImage || undefined,
      videoUrl: postVideo || undefined,
      locationName: postLocationName,
    });

    setPostTitle("");
    setPostContent("");
    setPostImage("");
    setPostVideo("");
    setShowCreateModal(false);
  };

  // Handle image local file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPostImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video local file upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoObjectUrl = URL.createObjectURL(file);
      setPostVideo(videoObjectUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Banner & Header Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📢</span>
              <h2 className="text-xl font-black text-slate-900">
                {language === "bn" ? "চিনা বাদাম সার্কেল" : "Chinabadam Circle"}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {language === "bn"
                ? "এখানে সার্কেলে সবসময় যেকোনো বার্তা, ছবি বা ভিডিও পোস্ট করা যাবে!"
                : "Post text, photos, or videos to your community anytime!"}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t("createPost")}</span>
          </button>
        </div>

        {/* District Selector & Category Bar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 shrink-0">📍 {language === "bn" ? "জেলা:" : "District:"}</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-extrabold bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-blue-600 cursor-pointer"
            >
              {districtsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isSelected
                      ? "bg-blue-700 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Always-Available Quick Post Box */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.realName}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-blue-600 shrink-0"
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-left text-xs font-semibold text-slate-500 px-4 py-3 rounded-2xl border border-slate-200/80 transition"
          >
            {language === "bn"
              ? `${currentUser.realName}, আপনার মনে কী আছে লিখুন? ছবি বা ভিডিও দিন...`
              : `What's on your mind, ${currentUser.realName}? Share photo/video...`}
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 px-1">
          <button
            onClick={() => {
              setActiveTabMedia("image");
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "ছবি আপলোড" : "Photo"}</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMedia("video");
              setShowCreateModal(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
          >
            <Video className="w-4 h-4 text-red-600" />
            <span>{language === "bn" ? "ভিডিও আপলোড" : "Video"}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4 text-blue-700" />
            <span>{language === "bn" ? "নতুন পোস্ট" : "Post"}</span>
          </button>
        </div>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentOpen = activeCommentPostId === post.id;

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              {/* Author Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-600 shadow-xs"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{post.authorName}</span>
                      <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.2 rounded-full">
                        📍 {post.authorDistrict}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {post.locationName} • {post.timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {post.videoUrl && (
                    <span className="text-[10px] font-black bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      <span>ভিডিও</span>
                    </span>
                  )}
                  <span className="text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl">
                    #{post.category}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h4 className="font-extrabold text-base text-slate-900 mt-3 leading-snug">
                {post.title}
              </h4>

              <p className="text-xs text-slate-700 mt-2 leading-relaxed font-normal whitespace-pre-line">
                {post.content}
              </p>

              {/* Video Player Display */}
              {post.videoUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-900 bg-black shadow-md relative group">
                  <video
                    src={post.videoUrl}
                    controls
                    preload="metadata"
                    className="w-full max-h-96 object-contain mx-auto"
                  />
                </div>
              )}

              {/* Image attachment */}
              {post.imageUrl && !post.videoUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full max-h-80 object-cover"
                  />
                </div>
              )}

              {/* Like / Comment / Share Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                    post.isLiked
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? "fill-red-600 text-red-600" : ""}`} />
                  <span>{post.likes} {language === "bn" ? "লাইক" : "Likes"}</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(isCommentOpen ? null : post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>{post.comments.length} {language === "bn" ? "কমেন্ট" : "Comments"}</span>
                </button>

                <button
                  onClick={() => {
                    alert(language === "bn" ? "পোস্টটি চিনা বাদামে শেয়ার করা হয়েছে!" : "Post shared!");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === "bn" ? "শেয়ার" : "Share"}</span>
                </button>
              </div>

              {/* Comments Drawer */}
              {isCommentOpen && (
                <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 p-3.5 rounded-2xl space-y-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2 text-xs">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="bg-white p-2 rounded-xl border border-slate-200 flex-1">
                          <span className="font-extrabold text-slate-900 block">
                            {comment.authorName}
                          </span>
                          <p className="text-slate-700 mt-0.5">{comment.text}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {comment.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={language === "bn" ? "একটি কমেন্ট লিখুন..." : "Write a comment..."}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-blue-600"
                    />
                    <button
                      onClick={() => {
                        addComment(post.id, commentInput);
                        setCommentInput("");
                      }}
                      className="bg-blue-700 text-white p-2 rounded-xl text-xs font-bold hover:bg-blue-800 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </motion.article>
          );
        })}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 my-8"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <span>📢</span>
                <span>{language === "bn" ? "সার্কেলে নতুন পোস্ট করুন" : "Create Circle Post"}</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "ক্যাটাগরি নির্বাচন করুন" : "Category"}
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as CircleCategory)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-blue-600"
                >
                  <option value="মাহফিল">🕌 মাহফিল</option>
                  <option value="খেলার আয়োজন">⚽ খেলার আয়োজন</option>
                  <option value="ভ্রমণ">✈️ ভ্রমণ</option>
                  <option value="রক্তদাতা">🩸 রক্তদাতা</option>
                  <option value="চাকরির খবর">💼 চাকরির খবর</option>
                  <option value="স্থানীয় আলোচনা">💬 স্থানীয় আলোচনা</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "জেলা বা শহর" : "District/City"}
                </label>
                <input
                  type="text"
                  value={postDistrict}
                  onChange={(e) => setPostDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "শিরোনাম" : "Post Title"}
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={language === "bn" ? "পোস্টের প্রধান বিষয় লিখুন..." : "Enter post headline..."}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "বিস্তারিত বিষয়বস্তু" : "Content"}
                </label>
                <textarea
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder={language === "bn" ? "এখানে আপনার পোস্টের বিস্তারিত লিখুন..." : "Write details..."}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
                  required
                />
              </div>

              {/* Media Attachment Selector Tabs */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTabMedia("image")}
                    className={`flex-1 text-xs font-black py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
                      activeTabMedia === "image"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "ছবি যুক্ত করুন" : "Add Photo"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTabMedia("video")}
                    className={`flex-1 text-xs font-black py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
                      activeTabMedia === "video"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{language === "bn" ? "ভিডিও যুক্ত করুন" : "Add Video"}</span>
                  </button>
                </div>

                {/* Photo Upload Section */}
                {activeTabMedia === "image" && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition"
                      >
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                        <span>{language === "bn" ? "গ্যালারি থেকে ছবি ফাইল আনুন" : "Choose Image File"}</span>
                      </button>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400">বা সরাসরি ছবির URL লিঙ্ক দিন:</p>
                    <input
                      type="url"
                      value={postImage}
                      onChange={(e) => setPostImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 font-medium text-slate-800"
                    />

                    {postImage && (
                      <div className="relative rounded-xl overflow-hidden h-24 bg-slate-100 border border-slate-300">
                        <img src={postImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPostImage("")}
                          className="absolute top-1 right-1 bg-slate-900/80 text-white p-1 rounded-full text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Video Upload Section */}
                {activeTabMedia === "video" && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={videoInputRef}
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="bg-red-50 text-red-800 hover:bg-red-100 font-bold text-xs px-3 py-2 rounded-xl border border-red-200 flex items-center gap-1.5 transition"
                      >
                        <UploadCloud className="w-4 h-4 text-red-600" />
                        <span>{language === "bn" ? "ডিভাইস থেকে ভিডিও ফাইল সিলেক্ট করুন" : "Select Video File"}</span>
                      </button>
                    </div>

                    {/* Quick Sample Video Buttons */}
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-500 mb-1">অথবা নমুনা ভিডিও সিলেক্ট করুন:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sampleVideoClips.map((clip, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPostVideo(clip.url)}
                            className="bg-white hover:bg-red-50 border border-slate-200 text-slate-800 hover:text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3 text-red-600" />
                            <span>{clip.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 pt-1">বা ভিডিওর সরাসরি MP4 URL লিঙ্ক দিন:</p>
                    <input
                      type="url"
                      value={postVideo}
                      onChange={(e) => setPostVideo(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/...mp4"
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 font-medium text-slate-800"
                    />

                    {postVideo && (
                      <div className="relative rounded-xl overflow-hidden bg-black p-1 border border-slate-800">
                        <video src={postVideo} controls className="w-full max-h-32 object-contain" />
                        <button
                          type="button"
                          onClick={() => setPostVideo("")}
                          className="absolute top-2 right-2 bg-slate-900/90 text-white p-1 rounded-full text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "bn" ? "পোস্ট প্রকাশ করুন" : "Publish Post"}</span>
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

    </div>
  );
};
