"use client";
import { LayoutDashboard, Code2, Calculator, Timer, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook to see which page we are on

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "LeetCode", href: "/leetcode", icon: Code2 },
  { name: "Grade Calc", href: "/grades", icon: Calculator },
  { name: "Research", href: "/research", icon: Timer }, // Changed icon to Timer
  { name: "Resources", href: "/resources", icon: BookOpen }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold from-blue-400 to-purple-500 bg-clip-text text-transparent">
          NEXUS-CSIT
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
              pathname === item.href 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}