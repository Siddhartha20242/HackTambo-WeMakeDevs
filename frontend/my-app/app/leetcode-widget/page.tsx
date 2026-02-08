"use client";
import React, { useEffect, useState } from "react";
import PomodoroTimer from "../components/tools/PomodoroTimer";
import { TamboProvider } from "@tambo-ai/react";

interface AISuggestion {
    id: number;
    message: string;
    timestamp: number;
}

function WidgetContent() {
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [currentSuggestion, setCurrentSuggestion] = useState<AISuggestion | null>(null);

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data.type === "UPDATE_FEEDBACK") {
                const newSuggestion: AISuggestion = {
                    id: Date.now(),
                    message: event.data.data.message,
                    timestamp: Date.now()
                };
                
                setSuggestions(prev => [...prev, newSuggestion]);
            }
        };
        
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    useEffect(() => {
        if (suggestions.length === 0) return;
        
        // Show the oldest unshown suggestion
        const nextSuggestion = suggestions.find(s => !currentSuggestion || s.id !== currentSuggestion.id);
        
        if (nextSuggestion && !currentSuggestion) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentSuggestion(nextSuggestion);
            
            // Auto-hide after 6 seconds
            const timer = setTimeout(() => {
                setCurrentSuggestion(null);
                setSuggestions(prev => prev.filter(s => s.id !== nextSuggestion.id));
            }, 6000);
            
            return () => clearTimeout(timer);
        }
    }, [suggestions, currentSuggestion]);

    return (
        <div className="relative w-full h-full">
            {/* Pomodoro Timer */}
            <PomodoroTimer 
                workDuration={25} 
                minimal={true}
                autoStart={true}
            />
            
            {/* AI Suggestion - One at a time */}
            {currentSuggestion && (
                <div className="fixed bottom-6 right-6 max-w-md z-[9999] animate-slideIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        
                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                {/* AI Icon */}
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                
                                {/* Message */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">AI Suggestion</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {currentSuggestion.message}
                                    </p>
                                </div>
                                
                                {/* Close button */}
                                <button 
                                    onClick={() => {
                                        setCurrentSuggestion(null);
                                        setSuggestions(prev => prev.filter(s => s.id !== currentSuggestion.id));
                                    }}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="h-1 bg-gray-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-shrink"></div>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes shrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
                
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out forwards;
                }
                
                .animate-shrink {
                    animation: shrink 6s linear forwards;
                }
            `}</style>
        </div>
    );
}

export default function LeetCodeWidget() {
    return (
        <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}>
            <WidgetContent />
        </TamboProvider>
    );
}