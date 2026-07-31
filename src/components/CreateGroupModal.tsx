import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  X,
  Check,
  Sparkles,
  Camera,
  MessageSquare,
  Search,
  UserPlus,
  ShieldCheck,
  Smile
} from "lucide-react";
import { motion } from "motion/react";
import { NearbyUser, GlobalUser } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    nearbyUsers,
    globalUsers,
    createGroupChat,
    currentUser,
    language,
  } = useApp();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<(NearbyUser | GlobalUser)[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=250"
  );
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Combine nearby and global users list
  const allAvailableUsers = [...nearbyUsers, ...globalUsers].filter(
    (u, index, self) => self.findIndex((x) => x.id === u.id) === index
  );

  const filteredUsers = allAvailableUsers.filter(
    (u) =>
      u.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presetAvatars = [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=250",
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=250",
  ];

  const toggleMemberSelection = (user: NearbyUser | GlobalUser) => {
    if (selectedMembers.some((m) => m.id === user.id)) {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== user.id));
    } else {
      setSelectedMembers((prev) => [...prev, user]);
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroupChat(
      groupName.trim(),
      description.trim() || "বন্ধুদের নতুন আড্ডা গ্রুপ ☕",
      selectedMembers,
      selectedAvatar
    );

    onClose();
    setGroupName("");
    setDescription("");
    setSelectedMembers([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-2xl border border-white/20">
              <Users className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl">
                {language === "bn" ? "নতুন বন্ধুদের গ্রুপ তৈরি করুন" : "Create New Friends Group"}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {language === "bn"
                  ? "অনেক বন্ধুরা মিলে একসাথে চ্যাট ও ভয়েস আড্ডা দিন"
                  : "Start a group chat & live voice lounge with multiple friends"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreateGroup} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Avatar Icon Selector */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-800 text-xs block">
              {language === "bn" ? "গ্রুপের ছবি / কভার আইকন:" : "Group Icon Cover:"}
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {presetAvatars.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    selectedAvatar === url
                      ? "border-blue-600 ring-2 ring-blue-500/40 scale-105"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  {selectedAvatar === url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-1">
            <label className="font-extrabold text-slate-800 text-xs block">
              {language === "bn" ? "গ্রুপের নাম (Group Name) *" : "Group Name *"}
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={language === "bn" ? "যেমন: ধানমন্ডি চা-আড্ডা সংঘ ☕" : "e.g. Dhanmondi Tea Adda Club ☕"}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Group Description */}
          <div className="space-y-1">
            <label className="font-extrabold text-slate-800 text-xs block">
              {language === "bn" ? "গ্রুপের তথ্য / বিষয়বস্তু:" : "Group Topic / Description:"}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === "bn" ? "যেমন: এলাকার বন্ধুদের প্রতিদিনের আড্ডা ও গল্পগবেষণা" : "e.g. Daily chat with neighborhood friends"}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Select Friends/Members */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>{language === "bn" ? "গ্রুপে বন্ধুদের যুক্ত করুন:" : "Add Friends to Group:"}</span>
              </label>
              <span className="text-[11px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {selectedMembers.length} {language === "bn" ? "জন সিলেক্টেড" : "Selected"}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "bn" ? "বন্ধুর নাম বা এলাকা দিয়ে খুঁজুন..." : "Search friends by name or district..."}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Members List */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredUsers.map((u) => {
                const isSelected = selectedMembers.some((m) => m.id === u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => toggleMemberSelection(u)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.realName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="font-extrabold text-xs">{u.realName}</div>
                        <div className="text-[10px] text-slate-500">{u.district}</div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 font-extrabold text-slate-700 rounded-2xl text-xs transition"
            >
              {language === "bn" ? "বাতিল" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={!groupName.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 disabled:opacity-50 text-white font-black rounded-2xl text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === "bn" ? "গ্রুপ খুলুন" : "Create Group Now"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
