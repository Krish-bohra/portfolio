"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, X } from "lucide-react";

export default function FloatingChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Krish 👋 I want to connect\nName:\nRequirement:\nPreferred Time:"
    );
    const url = `https://wa.me/917208413296?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[350px] h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#121212]/95 backdrop-blur-xl pointer-events-auto flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-white tracking-wide">AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <iframe 
              src="/chatbot.html"
              className="flex-1 w-full border-none bg-[#121212]"
              title="AI Chatbot"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        {/* WhatsApp Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 font-medium text-sm border border-[#25D366]/50"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat on WhatsApp</span>
        </motion.button>

        {/* Chatbot Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`flex items-center justify-center p-4 rounded-full text-white shadow-2xl transition-all duration-300 border backdrop-blur-md ${
            isChatOpen 
              ? 'bg-red-500/90 border-red-400 hover:bg-red-600' 
              : 'bg-blue-600/90 border-blue-400 hover:bg-blue-700 shadow-[0_0_25px_rgba(37,99,235,0.4)]'
          }`}
          aria-label="Toggle AI Chat"
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
}
