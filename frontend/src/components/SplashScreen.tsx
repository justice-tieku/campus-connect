import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        onFinish?.();
      }, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Logo size={56} showText={false} className="drop-shadow-sm" />
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Campus<span className="text-emerald-600">Connect</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            University Collaborative Workspace
          </p>
        </div>
      </div>
      <div className="absolute bottom-8 flex items-center gap-2 text-xs text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping"></span>
        Loading your workspace…
      </div>
    </div>
  );
}
