/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { AlertCircle, Lightbulb, CheckCircle2, X } from 'lucide-react';

interface AINotificationProps {
    pollingInterval?: number;
}

export default function AINotification({ pollingInterval = 2000 }: AINotificationProps) {
    const [notification, setNotification] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/notifications');
                const data = await res.json();
                
                if (data.trigger) {
                    setNotification(data);
                    setIsVisible(true);
                    setTimeout(() => setIsVisible(false), 6000);
                }
            } catch (err) {
                // Silent
            }
        }, pollingInterval);

        return () => clearInterval(interval);
    }, [pollingInterval]);

    if (!notification || !isVisible) return null;

    const styles = {
        hint: {
            icon: <Lightbulb size={14} className="text-amber-400" />,
            bg: "from-amber-500/10 via-orange-500/5 to-transparent",
            border: "border-amber-500/20",
            text: "text-amber-100"
        },
        warning: {
            icon: <AlertCircle size={14} className="text-red-400" />,
            bg: "from-red-500/10 via-pink-500/5 to-transparent",
            border: "border-red-500/20",
            text: "text-red-100"
        },
        success: {
            icon: <CheckCircle2 size={14} className="text-emerald-400" />,
            bg: "from-emerald-500/10 via-green-500/5 to-transparent",
            border: "border-emerald-500/20",
            text: "text-emerald-100"
        },
        error: {
            icon: <AlertCircle size={14} className="text-red-400" />,
            bg: "from-red-500/10 via-rose-500/5 to-transparent",
            border: "border-red-500/20",
            text: "text-red-100"
        }
    };

    const style = styles[notification.trigger as keyof typeof styles] || styles.hint;

    return (
        <div className="fixed top-20 right-4 z-[999999] w-[220px]">
            {/* Card */}
            <div className={`
                relative backdrop-blur-xl bg-black/60
                border ${style.border} rounded-xl
                shadow-2xl
                transition-all duration-300
            `}>
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} rounded-xl opacity-40`}></div>
                
                {/* Content */}
                <div className="relative p-3">
                    <div className="flex items-start gap-2">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            {style.icon}
                        </div>
                        
                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-[11px] leading-relaxed ${style.text} font-medium`}>
                                {notification.message}
                            </p>
                        </div>
                        
                        {/* Close */}
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${
                            notification.trigger === 'hint' ? 'bg-amber-400' :
                            notification.trigger === 'warning' ? 'bg-red-400' :
                            notification.trigger === 'success' ? 'bg-emerald-400' :
                            'bg-red-400'
                        } animate-shrink-6s`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}