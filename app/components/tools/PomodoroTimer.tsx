"use client";
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Fixed typo
import { Card, CardContent } from '@/components/ui/card'; // Added missing imports

export default function PomodoroTimer({ workDuration = 25, taskName = "CSIT Study" }) {
    const [seconds, setSeconds] = useState(workDuration * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
    
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        setIsActive(false); 
                        if (interval) clearInterval(interval);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
    
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]); 

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
    
    // Circular Progress Math
    const totalSeconds = workDuration * 60;
    const percentage = (seconds / totalSeconds) * 100;
    const radius = 70;
    const strokeDasharray = 2 * Math.PI * radius; // Approx 439.8
    const offset = strokeDasharray - (percentage / 100) * strokeDasharray;
    
    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-md p-6">
            <CardContent className="flex flex-col items-center p-0"> {/* Adjusted padding */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="absolute w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                        <circle 
                            cx="80" cy="80" r={radius} 
                            className="stroke-white/5 fill-none" 
                            strokeWidth="8" 
                        />
                        <circle
                            cx="80" cy="80" r={radius}
                            className="stroke-blue-500 fill-none transition-all duration-1000 ease-linear"
                            strokeWidth="8"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="text-4xl font-mono font-bold text-white relative z-10">
                        {formatTime(seconds)}
                    </span>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-semibold">
                        {taskName}
                    </p>
                    <div className="flex gap-4 mt-4 justify-center">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => setIsActive(!isActive)}
                        >
                            {isActive ? <Pause size={18} /> : <Play size={18} />}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => { setIsActive(false); setSeconds(workDuration * 60); }}
                        >
                            <RotateCcw size={18} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}