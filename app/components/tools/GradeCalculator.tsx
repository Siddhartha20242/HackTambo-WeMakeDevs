"use client";
import React, { useState } from "react";
import { Calculator, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SEMESTER_1_SUBJECTS = [
  { name: "Digital Logic", credits: 3 },
  { name: "C Programming", credits: 3 },
  { name: "Mathematics I", credits: 3 },
  { name: "Physics", credits: 3 },
  { name: "IIT", credits: 3 },
];

export default function GradeCalculator() {
  const [grades, setGrades] = useState<Record<string, string>>({});

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    // Standard 4.0 Scale Mapping
    const gradeMap: Record<string, number> = {
      "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "D": 1.0, "F": 0.0
    };

    SEMESTER_1_SUBJECTS.forEach((sub) => {
      const g = grades[sub.name]?.toUpperCase();
      if (gradeMap[g] !== undefined) {
        totalPoints += gradeMap[g] * sub.credits;
        totalCredits += sub.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <GraduationCap size={20} /> Semester 1 Tracker
        </CardTitle>
        <div className="text-2xl font-mono font-bold text-green-400">
          GPA: {calculateGPA()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {SEMESTER_1_SUBJECTS.map((sub) => (
          <div key={sub.name} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-white/5">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{sub.name}</span>
              <span className="text-[10px] text-slate-500 uppercase">{sub.credits} Credits</span>
            </div>
            <Input 
              className="w-16 h-8 bg-black/50 border-white/10 text-center"
              placeholder="A"
              maxLength={2}
              onChange={(e) => setGrades({ ...grades, [sub.name]: e.target.value })}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}