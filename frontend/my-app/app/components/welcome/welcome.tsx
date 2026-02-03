"use client";
import React, { useState } from "react";
import { useUser } from "../UserContext";
import { Shield, ChevronRight } from "lucide-react";

export default function WelcomeScreen() {
  const { setName } = useUser();
  const [inputValue, setInputValue] = useState("");

  const handleInit = () => {
    if (inputValue.trim()) setName(inputValue);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center p-6">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-blue-500/20 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="p-4 bg-blue-600/10 rounded-full border border-blue-600/20">
            <Shield className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Nexus Interface</h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Identify to activate generative workspace</p>
        </div>

        <div className="space-y-4">
          <input 
            autoFocus
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
            placeholder="OPERATOR NAME..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInit()}
          />
          <button 
            onClick={handleInit}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            Initialize Interface
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}