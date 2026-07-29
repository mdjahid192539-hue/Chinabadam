import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export const AiAssistantModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language, t } = useApp();

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: language === "bn"
        ? "আসসালামু আলাইকুম! আমি চিনা বাদাম AI সহকারী। আমি আপনাকে আশেপাশের দর্শনীয় স্থান, মসজিদ, নামাযের সময়সূচী ও স্থানীয় তথ্য জানতে সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?"
        : "Assalamu Alaikum! I am Chinabadam AI Assistant. Ask me about local places, mosques, prayer guidance, or travel tips!"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          context: `User language: ${language}`,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.error || (language === "bn" ? "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।" : "Sorry, no response available.")
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: language === "bn"
            ? "দুঃখিত, সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি।"
            : "Error communicating with AI assistant server."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-100 h-[520px] flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {t("aiAssistant")}
              </h3>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gemini AI Powered
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-2 my-2 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-medium shadow-2xs ${
                  m.sender === "user"
                    ? "bg-blue-700 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                <span>{language === "bn" ? "উত্তর ভাবছে..." : "Generating response..."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("askAi")}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-blue-600"
          />

          <button
            onClick={handleSend}
            disabled={!prompt.trim() || loading}
            className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white p-2.5 rounded-2xl shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
