"use client";

import { useUser } from "./UserContext";

export function Header() {
  const { user } = useUser();

  return (
    <header className="h-16 border-b border-white/10 flex items-center px-8 bg-black/20 backdrop-blur-md justify-between">
      <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-widest">
        {user.name ? "Neural_Link: Active" : "Initializing..."}
      </span>
      <div className="flex flex-col text-right">
        {/* If name is null, show 'Guest', otherwise show the saved name */}
        <span className="font-bold text-sm">
          {user.name || "Guest User"}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
          {user.major}  {user.semester}
        </span>
      </div>
    </header>
  );
}