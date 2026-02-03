// src/app/page.tsx
"use client";
import { useUser } from "./components/UserContext";
import WelcomeScreen from "./components/welcome/welcome";
import NexusDashboard from "./dashboard/page"; 

export default function Home() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-black">
      {!user.name ? (
        <WelcomeScreen />
      ) : (
        <div className="animate-in fade-in duration-1000">
          <NexusDashboard />
        </div>
      )}
    </main>
  );
}