interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 32, className = "", showText = true }: LogoProps) {
  const logoSize = size || 32;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="Campus Connect Logo"
        className="object-contain shrink-0"
        style={{ width: logoSize, height: logoSize }}
      />
      {showText && (
        <span
          className="font-bold tracking-tight text-slate-900"
          style={{ fontSize: Math.max(14, logoSize * 0.5) }}
        >
          Campus <span className="text-emerald-600">Connect</span>
        </span>
      )}
    </div>
  );
}