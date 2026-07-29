import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SUPPORTED_LANGUAGES, LanguageOption } from "../utils/translations";
import { Globe, Search, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (code: Language) => {
    setLanguage(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {language === "bn" ? "সারা পৃথিবীর ভাষা (World Languages)" : "Select World Language"}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {language === "bn" ? "আপনার পছন্দের ভাষা নির্বাচন করুন" : "Choose your preferred language"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative my-3 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === "bn" ? "ভাষা খুঁজুন (Search language)..." : "Search language..."}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-slate-200"
            />
          </div>

          {/* Language Options Grid */}
          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {filteredLanguages.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition ${
                    isSelected
                      ? "bg-blue-700 text-white border-blue-800 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <span className="font-extrabold text-xs block">
                        {lang.nativeName}
                      </span>
                      <span
                        className={`text-[10px] font-medium block ${
                          isSelected ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {lang.name} ({lang.code.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}

            {filteredLanguages.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs font-bold">
                {language === "bn" ? "কোন ভাষা পাওয়া যায়নি" : "No language found"}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
