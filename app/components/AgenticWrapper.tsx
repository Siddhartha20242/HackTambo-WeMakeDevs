"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, BrainCircuit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AgenticWrapperProps {
  children: React.ReactNode;
  confidence: number;
  componentName: string;
  onReward: (reward: number) => void;
}

export function AgenticWrapper({ children, confidence, componentName, onReward }: AgenticWrapperProps) {
  const [status, setStatus] = useState<"suggested" | "approved" | "rejected">("suggested");

  // Logic Gate Rule: If AI confidence is too low, we don't even show a ghost.
  if (confidence < 0.60 || status === "rejected") return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full group"
    >
      {/* 👻 DRAFT UI: Apply opacity-50 and grayscale to suggested state */}
      <div className={`transition-all duration-700 ${
        status === "suggested" ? "opacity-30 grayscale blur-sm pointer-events-none" : "opacity-100 grayscale-0 blur-0"
      }`}>
        {children}
      </div>

      <AnimatePresence>
        {status === "suggested" && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0a0a0a]/90 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-w-[280px] space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-blue-400 flex items-center gap-1.5 font-bold uppercase">
                  <BrainCircuit size={12} /> Agent Suggestion
                </span>
                <span className="text-slate-500">Q: {confidence.toFixed(2)}</span>
              </div>

              {/* 📊 CONFIDENCE UI: Progress Bar */}
              <div className="space-y-1">
                <Progress value={confidence * 100} className="h-1 bg-white/5" />
                <p className="text-[9px] text-slate-500 italic">Prediction Match: {Math.round(confidence * 100)}%</p>
              </div>

              {/* 🎯 APPROVAL UI: Reward Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => { setStatus("approved"); onReward(3); }} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 h-8 text-[10px] font-bold"
                >
                  <Check size={14} className="mr-2" /> APPROVE
                </Button>
                <Button 
                  onClick={() => { setStatus("rejected"); onReward(-1); }} 
                  variant="outline" className="h-8 border-white/10 hover:bg-red-500/10"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}