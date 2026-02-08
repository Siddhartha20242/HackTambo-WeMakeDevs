"use client";
import { useUser } from "./components/UserContext";
import { useState } from "react";

export default function WelcomeScreen() {
  const { user, setName } = useUser();
  const [inputValue, setInputValue] = useState("");

  // If the context has a name, this screen disappears
  if (user.name) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="p-8 border border-blue-500/50 bg-slate-900 rounded-xl">
        <h2 className="text-xl font-mono text-blue-400 mb-4">IDENTIFICATION REQUIRED</h2>
        <input 
          className="bg-black border border-white/20 p-2 text-white w-full mb-4"
          placeholder="Enter your name..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          onClick={() => setName(inputValue)}
          className="w-full bg-blue-600 p-2 font-bold"
        >
          INITIALIZE
        </button>
      </div>
    </div>
  );
}