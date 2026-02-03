/* eslint-disable react-hooks/purity */
"use client";
import React, { useState } from "react";
// Synchronized to RegistryKeys to match your import
import { COMPONENT_REGISTRY, type RegistryKey } from "../tambo/registry";
import { AgenticWrapper } from "../components/AgenticWrapper";
import { Bug, Plus, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NexusDashboard() {
  // 1. Properly typed state using RegistryKeys
  const [activeTools, setActiveTools] = useState<{ id: string; type: RegistryKey; confidence: number }[]>([]);

  const triggerPing = () => {
    const audio = new Audio("/sounds/ping.mp3");
    audio.play().catch(() => console.log("Audio blocked until interaction"));
  };

  const spawnTool = (type: RegistryKey) => {
    // eslint-disable-next-line react-hooks/purity
    const id = Math.random().toString(36).substring(2, 9);
    // eslint-disable-next-line react-hooks/purity
    const mockConfidence = Math.random() * (0.98 - 0.65) + 0.65;
    
    setActiveTools((prev) => [...prev, { id, type, confidence: mockConfidence }]);
    triggerPing();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center font-black">N</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Nexus CSIT</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Phase 02 // Siddhartha</p>
          </div>
        </div>

        {/* --- Debug Menu: Spawning Logic --- */}
        <div className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10 items-center">
          <span className="text-[9px] font-bold text-slate-500 ml-2 mr-2 flex items-center gap-1">
            <Bug size={10} /> DEBUG SPAWNER:
          </span>
          {(Object.keys(COMPONENT_REGISTRY) as RegistryKey[]).map((key) => (
            <Button 
              key={key} 
              variant="ghost" 
              size="sm" 
              className="text-[9px] uppercase font-bold h-7 hover:bg-white/10" 
              onClick={() => spawnTool(key)}
            >
              <Plus size={10} className="mr-1" /> {key}
            </Button>
          ))}
        </div>
      </header>

      {/* --- Adaptive Canvas: Component Mapper --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeTools.map((tool) => {
          // 2. Access the component via the Registry
          const entry = COMPONENT_REGISTRY[tool.type];
          
          // 3. Fallback for safety (prevents undefined errors)
          if (!entry) return null;
          
          const Tool = entry.Component;

          return (
            <AgenticWrapper 
              key={tool.id} 
              confidence={tool.confidence} 
              componentName={tool.type}
              onReward={(r) => console.log(`Reward for ${tool.type}: ${r}`)}
            >
              <Tool subject={""} resourceType={"PDF"} links={[]} />
            </AgenticWrapper>
          );
        })}
      </div>

      {activeTools.length === 0 && (
        <div className="h-[50vh] flex flex-col items-center justify-center opacity-20">
          <Terminal size={40} className="mb-4" />
          <p className="text-xs font-mono uppercase tracking-[0.4em]">Awaiting AI Prediction Signal...</p>
        </div>
      )}
    </div>
  );
}