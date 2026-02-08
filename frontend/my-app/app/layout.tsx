"use client"; // 👈 1. Must be Client Component for usePathname
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/sidebar";
import { UserProvider } from "./components/UserContext";
import { ThemeProvider } from "./components/theme-provoider";
import { Header } from "./components/headers";
import { TamboProvider } from "@tambo-ai/react"; 
import { usePathname } from "next/navigation"; // 👈 2. Import Pathname Hook

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Note: Removed 'metadata' export because this is now a Client Component.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // 👇 3. Check if we are inside the widget
  const isWidget = pathname?.includes("/leetcode-widget");

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}>
            <UserProvider>
              
              {/* 👇 4. CONDITIONAL LAYOUT */}
              {isWidget ? (
                // A. WIDGET MODE: Clean, Transparent, No Sidebar
                <main className="min-h-screen w-full bg-transparent">
                  {children}
                </main>
              ) : (
                // B. DASHBOARD MODE: Sidebar, Header, Backgrounds
                <div className="flex h-screen overflow-hidden bg-[#0a0a0a] bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px]">
                  <Sidebar /> 
                  <div className="flex-1 flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <Header /> 
                    <main className="flex-1 overflow-y-auto p-6 relative z-10">
                      {children} 
                    </main>
                  </div>
                </div>
              )}

            </UserProvider>
          </TamboProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}