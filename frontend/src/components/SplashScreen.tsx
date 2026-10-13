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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-surface-950 transition-opacity duration-500 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-brand-500/20 blur-xl"></div>
          <Logo size={88} className="relative drop-shadow-lg" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
            Campus<span className="text-brand-600">Connect</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-surface-500 dark:text-surface-400">
            Connecting students, faculty & campus builders
          </p>
        </div>
      </div>
      <div className="absolute bottom-10 flex items-center gap-2 text-xs text-surface-400">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-ping"></span>
        Loading your campus experience…
      </div>
    </div>
  );
}
