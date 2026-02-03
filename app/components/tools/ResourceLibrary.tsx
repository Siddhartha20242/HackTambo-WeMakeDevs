"use client";
import React from "react";
import { BookOpen, ExternalLink, FileText, Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResourceSchema} from "@/lib/schema";

export default function ResourceLibrary({ 
  subject = "C Programming", 
  resourceType = "PDF",
  links = [] 
}: ResourceSchema) {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <BookOpen size={20} /> {subject} Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.length > 0 ? links.map((link, i) => (
          <a 
            key={i} 
            href={link.url} 
            target="_blank" 
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {resourceType === "PDF" ? <FileText size={16} className="text-red-400" /> : <Video size={16} className="text-blue-400" />}
              <span className="text-sm font-medium">{link.title}</span>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-white" />
          </a>
        )) : (
          <p className="text-sm text-slate-500 text-center py-4">No resources linked for this session.</p>
        )}
      </CardContent>
    </Card>
  );
}