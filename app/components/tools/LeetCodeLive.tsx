"use client";
import React from "react";
import Editor from "@monaco-editor/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Code2 } from "lucide-react";

export default function LeetCodeLive({ 
  problemTitle = "Two Sum", 
  difficulty = "Easy", 
  language = "python", 
  initialCode = "# Write your solution here...",
  aiFeedback = "I'm monitoring your logic. Start coding to receive live hints."
}) {
  return (
    <Card className="w-full h-600px bg-black/40 border-white/10 backdrop-blur-md overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Code2 className="text-blue-400" size={18} />
          <CardTitle className="text-md font-mono text-slate-200">{problemTitle}</CardTitle>
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">Live</Badge>
        </div>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono">
          {language.toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={initialCode}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme('transparent-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: { 'editor.background': '#00000000' }
            });
          }}
          theme="transparent-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </CardContent>

      <div className="h-32 bg-black/60 border-t border-white/10 p-4 font-mono text-sm leading-relaxed">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Terminal size={14} /> AI Live Feedback
        </div>
        <div className="text-blue-300/80 italic">{">"} {aiFeedback}</div>
      </div>
    </Card>
  );
}