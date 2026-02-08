// src/app/leetcode-widget/layout.tsx
export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-transparent min-h-screen">
      {/* This renders ONLY the widget page content, stripped of everything else */}
      {children}
    </div>
  );
}