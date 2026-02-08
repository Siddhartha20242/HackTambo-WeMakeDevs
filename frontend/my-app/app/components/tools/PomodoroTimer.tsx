"use client";
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroTimer({ 
    workDuration = 25, 
    autoStart = false,
    minimal = false
}) {
    const [seconds, setSeconds] = useState(workDuration * 60);
    const [isActive, setIsActive] = useState(autoStart);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => (prev <= 1 ? (setIsActive(false), 0) : prev - 1));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const totalSeconds = workDuration * 60;
    const percentage = (seconds / totalSeconds) * 100;

    // 🎨 ULTRA COMPACT MODE - 50px Circle
    if (minimal) {
        const radius = 20;
        const strokeDasharray = 2 * Math.PI * radius; 
        const offset = strokeDasharray - (percentage / 100) * strokeDasharray;

        return (
            <div className="relative group cursor-pointer">
                {/* Container */}
                <div className="relative backdrop-blur-sm bg-black/30 border border-white/20 rounded-full p-1 shadow-lg hover:scale-110 transition-all">
                    <svg width="50" height="50" style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background */}
                        <circle 
                            cx="25" cy="25" r={radius} 
                            className="stroke-white/10 fill-none" 
                            strokeWidth="2.5" 
                        />
                        {/* Progress with gradient */}
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#60a5fa" />
                                <stop offset="100%" stopColor="#a78bfa" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="25" cy="25" r={radius}
                            className="fill-none transition-all duration-1000"
                            stroke="url(#grad)"
                            strokeWidth="2.5"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    
                    {/* Time */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[9px] font-mono font-bold text-white">
                            {formatTime(seconds)}
                        </span>
                    </div>
                    
                    {/* Hover Controls - Appear below */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-white/10">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsActive(!isActive); }} 
                            className="text-white/70 hover:text-blue-400 transition-colors"
                        >
                            {isActive ? <Pause size={8} /> : <Play size={8} />}
                        </button>
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation();
                                setIsActive(false); 
                                setSeconds(workDuration * 60); 
                            }} 
                            className="text-white/70 hover:text-red-400 transition-colors"
                        >
                            <RotateCcw size={8} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ... your normal dashboard mode code stays the same
    return null; // Add your full dashboard version here
}