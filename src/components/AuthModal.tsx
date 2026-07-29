import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, X } from "lucide-react";
import { motion } from "motion/react";
import { ChinabadamLogo } from "./ChinabadamLogo";

export const AuthModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, currentUser, updateUserProfile, t, language } = useApp();

  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneInput, setPhoneInput] = useState("+8801712345678");
  const [otpInput, setOtpInput] = useState("1234");

  // Profile fields for Step 3
  const [realName, setRealName] = useState(currentUser.realName);
  const [country, setCountry] = useState(currentUser.country);
  const [district, setDistrict] = useState(currentUser.district);
  const [bio, setBio] = useState(currentUser.bio);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("profile");
  };

  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim()) {
      alert(language === "bn" ? "আসল নাম আবশ্যক!" : "Real name is required!");
      return;
    }

    updateUserProfile({
      phone: phoneInput.trim(),
      realName: realName.trim(),
      country,
      district,
      bio,
    });

    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <ChinabadamLogo size="sm" showText={true} textColor="text-slate-900" />
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Phone Entry */}
        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              {language === "bn"
                ? "আপনার মোবাইল নম্বর দিয়ে চিনা বাদামে লগইন করুন। আপনার নম্বরটি শতভাগ গোপন থাকবে।"
                : "Enter your mobile number to log in. Your phone number is strictly kept private."}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {language === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 font-extrabold text-xs text-slate-900 focus:outline-blue-600"
                  required
                />
              </div>
            </div>

            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t("phoneHidden")}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>{language === "bn" ? "OTP কোড পাঠান" : "Send OTP Code"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              {phoneInput} {language === "bn" ? "নম্বরে ৪ ডিজিটের একটি যাচাইকরণ কোড পাঠানো হয়েছে।" : "A 4-digit code was sent to this number."}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t("otpEnter")}
              </label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                maxLength={4}
                className="w-full tracking-widest text-center text-lg font-black py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("verifyLogin")}</span>
            </button>
          </form>
        )}

        {/* Step 3: Setup Mandatory Real Name Profile */}
        {step === "profile" && (
          <form onSubmit={handleCompleteSetup} className="space-y-3">
            <p className="text-xs text-blue-900 font-bold bg-blue-50 p-2.5 rounded-xl border border-blue-200">
              📌 {language === "bn" ? "আসল নাম লেখা বাধ্যতামূলক।" : "Real Name is Mandatory."}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t("realNameMandatory")}
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t("bio")}
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition"
            >
              {language === "bn" ? "অ্যাকাউন্ট সম্পন্ন করুন" : "Complete Setup"}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
};
