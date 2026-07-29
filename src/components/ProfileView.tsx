import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  UserCheck,
  ShieldCheck,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Users,
  Heart,
  Globe,
  Lock,
  X,
  PhoneCall,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";

export const ProfileView: React.FC = () => {
  const { currentUser, updateUserProfile, t, language, setIsLoginModalOpen } = useApp();

  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form Fields
  const [realName, setRealName] = useState(currentUser.realName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [country, setCountry] = useState(currentUser.country);
  const [district, setDistrict] = useState(currentUser.district);
  const [gender, setGender] = useState(currentUser.gender);
  const [dob, setDob] = useState(currentUser.dob);
  const [bio, setBio] = useState(currentUser.bio);
  const [interestsText, setInterestsText] = useState(currentUser.interests.join(", "));
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim()) {
      alert(language === "bn" ? "আসল নাম দেওয়া বাধ্যতামূলক!" : "Real name is mandatory!");
      return;
    }

    const newInterests = interestsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updateUserProfile({
      realName: realName.trim(),
      phone: phone.trim(),
      country: country.trim(),
      district: district.trim(),
      gender: gender as any,
      dob,
      bio: bio.trim(),
      interests: newInterests,
      avatar: avatar.trim(),
    });

    setShowEditModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
        
        {/* Cover Graphic */}
        <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl -mx-2 -mt-2 p-4 flex items-end justify-between">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t("phoneHidden")}</span>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="bg-white hover:bg-slate-100 text-blue-900 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{t("editProfile")}</span>
          </button>
        </div>

        {/* Profile Avatar & Names */}
        <div className="px-2 -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.realName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" title="Online Active"></span>
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">
                  {currentUser.realName}
                </h1>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                  {language === "bn" ? "আসল নাম (Verified)" : "Real Name"}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>📍 {currentUser.district}, {currentUser.country}</span>
              </p>
            </div>
          </div>

          {/* Friends Counter Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                {t("friends")}
              </span>
              <span className="text-base font-black text-slate-900">
                {currentUser.friendsCount} {language === "bn" ? "জন" : "Friends"}
              </span>
            </div>
          </div>

        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            {t("bio")}
          </h3>
          <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            "{currentUser.bio}"
          </p>
        </div>

        {/* Interests Tags */}
        <div className="mt-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            {t("interests")}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentUser.interests.map((interest, idx) => (
              <span
                key={idx}
                className="text-xs font-extrabold bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-xl shadow-2xs"
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
              {t("gender")}
            </span>
            <span className="font-black text-slate-800">{currentUser.gender}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
              {t("dob")}
            </span>
            <span className="font-black text-slate-800">{currentUser.dob}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
              {t("country")}
            </span>
            <span className="font-black text-slate-800">{currentUser.country}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
              {t("districtCity")}
            </span>
            <span className="font-black text-slate-800">{currentUser.district}</span>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <span>👤</span>
                <span>{t("editProfile")}</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("realNameMandatory")}
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === "bn" ? "প্রোফাইল ছবি URL" : "Profile Avatar URL"}
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("country")}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("districtCity")}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("gender")}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  >
                    <option value="পুরুষ">পুরুষ (Male)</option>
                    <option value="নারী">নারী (Female)</option>
                    <option value="অন্যান্য">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t("dob")}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("bio")}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t("interests")} (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="ভ্রমণ, ক্রিকেট, ইসলামিক আলোচনা, বই পড়া"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {language === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md"
                >
                  {language === "bn" ? "সেভ করুন" : "Save Changes"}
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}

    </div>
  );
};
