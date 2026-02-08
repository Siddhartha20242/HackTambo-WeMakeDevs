"use client";
import React, { useEffect, useState } from "react";

interface Suggestion {
  title: string;
  hint: string;
  severity: 'info' | 'warning' | 'error';
}

export default function GroqSuggestions() {
  const [analysis, setAnalysis] = useState<Suggestion | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // Initial "Ready" message
    setAnalysis({ title: "NEXUS", hint: "AI Brain connected.", severity: "info" });
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "CODE_UPDATE") {
        try {
          const response = await fetch("http://127.0.0.1:8000/analyze-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: event.data.code,
              problem: event.data.problem,
              timestamp: Date.now().toString() // Sending as string to match your backend
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.message || data.analysis || JSON.stringify(data);
            const isError = text.toLowerCase().includes("bug") || text.toLowerCase().includes("error");
            
            setAnalysis({
              title: isError ? "BUG ALERT" : "INSIGHT",
              hint: text.replace("🤖 NEXUS AI:", "").trim(),
              severity: isError ? 'error' : 'info'
            });
            setIsExpanded(true);
            setTimeout(() => setIsExpanded(false), 8000); // Auto-collapse
          }
        } catch (err) {
          console.error("Backend unreachable");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!isMounted || !analysis) return null;

  return (
    <div 
      className="flex items-center justify-end group pointer-events-auto mb-2 mr-3"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`
        bg-black border border-white/20 text-white text-xs px-3 py-2 rounded-l-md shadow-2xl
        transition-all duration-500 ease-in-out overflow-hidden
        ${isExpanded ? 'max-w-[350px] opacity-100' : 'max-w-0 opacity-0 border-none'}
      `}>
        <span className={`font-bold mr-2 ${analysis.severity === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
          {analysis.title}:
        </span>
        <span className="opacity-90 font-mono whitespace-normal">{analysis.hint}</span>
      </div>

      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/10
        transition-all duration-300 z-50 cursor-pointer
        ${analysis.severity === 'error' ? 'bg-red-600 animate-pulse' : 'bg-slate-900 text-blue-400'}
      `}>
        {analysis.severity === 'error' ? '⚠️' : '🧠'}
      </div>
    </div>
  );
}