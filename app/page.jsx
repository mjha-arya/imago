"use client";
import React, { useState, useEffect, useRef } from 'react';

// --- IMAGE LINKS ---
const USER_IMAGE = "https://unsplash.com/photos/MFrlMdRl18U/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bG9uZWx5JTIwbWFufGVufDB8fHx8MTc2NTc2MjM4OHwy&force=true"; 
const WITNESS_IMAGE = "https://unsplash.com/photos/_8qzW8tQbNk/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzY1NzYyMzcwfA&force=true";

export default function WitnessDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'witness', text: "Greetings. I am here as a space for your thoughts. I offer no fixes, only presence." }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSpeak = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Display User Message Immediately
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setIsProcessing(true);

    try {
      // 2. Call the Backend API
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      
      const data = await res.json();
      
      // 3. Display AI Reflection
      setMessages(prev => [...prev, { role: 'witness', text: data.reflection }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'witness', text: "I am having trouble connecting, but I am still here with you." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main 
      className="min-h-screen bg-[#FFFDF9] text-stone-800 selection:bg-amber-200"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} 
    >
      
      {/* --- VISUAL STAGE --- */}
      <section className="h-[34vh] relative flex items-center justify-center gap-12 md:gap-32 overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#f8f4e9]">
        
        {/* Background Atmosphere */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-amber-100/50 rounded-full blur-3xl transition-all duration-1000 ${isProcessing ? "scale-110 opacity-80" : "scale-100 opacity-30"}`} />

        {/* AVATAR 1: YOU */}
        <div className="z-10 flex flex-col items-center gap-6 transition-all duration-500">
          <div className={`relative w-40 h-40 md:w-52 md:h-52 rounded-full border-[5px] border-white bg-stone-200 shadow-xl overflow-hidden transition-transform duration-300 ${isProcessing ? "scale-95 grayscale-[0.3]" : "scale-105"}`}>
            <img 
              src={USER_IMAGE}
              alt="You"
              className="w-full h-full object-cover"
            />
            {input.length > 0 && (
              <div className="absolute inset-0 rounded-full border-8 border-amber-400/40 animate-ping" />
            )}
          </div>
          <span className="text-xl uppercase tracking-widest text-stone-500 font-bold">You</span>
        </div>

        {/* CONNECTION LINE */}
        <div className={`h-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent transition-all duration-1000 ${isProcessing ? "w-32 opacity-100" : "w-16 opacity-30"}`} />

        {/* AVATAR 2: THE WITNESS */}
        <div className="z-10 flex flex-col items-center gap-6">
          <div className={`relative w-44 h-44 md:w-60 md:h-60 rounded-full border-[5px] border-[#f0eadd] bg-[#e6ddd0] shadow-xl overflow-hidden transition-all duration-1000 ${isProcessing ? "scale-105 ring-8 ring-amber-100 shadow-2xl brightness-110" : "scale-100 brightness-100"}`}>
            <img 
              src={WITNESS_IMAGE} 
              alt="Witness"
              className="w-full h-full object-cover scale-110" 
            />
            {isProcessing && <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay animate-pulse" />}
          </div>
          <span className="text-xl uppercase tracking-widest text-amber-700 font-bold">The Witness</span>
        </div>

      </section>

      {/* --- INTERFACE LAYER --- */}
      {/* CHANGE 1: Reduced curve from rounded-t-[1.5rem] to rounded-t-1sl */}
      <section className="h-[73vh] flex flex-col bg-white rounded-t-1sl shadow-[0_-10px_50px_rgba(231,226,215,0.4)] border-t border-stone-50/50 relative z-20">
        
        {/* === HEADER === */}
        {/* CHANGE 2: Reduced curve to match */}
        <div className="pt-8 text-center bg-white rounded-t-2xl shrink-0">
          <p className="text-stone-400 text-xs uppercase tracking-[0.2em] font-bold">
            A sacred space for witnessing, not fixing.
          </p>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-2xl p-8 rounded-[2.5rem] text-lg leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500
                ${msg.role === 'user' 
                  ? 'bg-stone-100 text-stone-700 rounded-br-none' 
                  : 'bg-[#fefaf3] text-amber-900 rounded-bl-none border border-amber-100/50'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isProcessing && (
            <div className="flex justify-start animate-pulse ml-6">
              <span className="text-lg text-amber-500 font-medium tracking-wide">
                Witness is reflecting...
              </span>
            </div>
          )}
        </div>

        {/* Input Area */}
        {/* CHANGE 3: Reduced curve to match */}
        <div className="p-10 bg-white pb-16 rounded-t-2xl">
          <form onSubmit={handleSpeak} className="max-w-5xl mx-auto relative flex items-center gap-4">
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your burden here..."
              className="w-full bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 rounded-full py-8 pl-10 pr-44 text-lg  focus:outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-50 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="absolute right-4 top-3 bottom-3 bg-[#d4a373] hover:bg-[#c29363] disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-full px-12 text-xl font-bold tracking-wide transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              Speak
            </button>
          </form>

          {/* PRIVACY NOTICE */}
          <div className="text-center mt-8">
            <p className="text-stone-500 text-2xl flex items-center justify-center gap-3 font-medium">
              <span className="text-3xl">🔒</span> This app does not store any data. It is a safe place to share.
            </p>
          </div>
          
        </div>

      </section>
    </main>
  );
}