"use client";
import { useEffect, useState } from "react";

export default function AIWidget() {
    const [feedback, setFeedback] = useState<string | null>(null);

    useEffect(() => {

        const handler = (event: MessageEvent) => {
            if (event.data.type === "UPDATE_FEEDBACK") {
                setFeedback(event.data.data.message);
                
                setTimeout(() => setFeedback(null), 8000);
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, []);

    if (!feedback) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-2xl animate-slide-up">
            <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <p className="text-sm font-medium">{feedback}</p>
            </div>
        </div>
    );
}