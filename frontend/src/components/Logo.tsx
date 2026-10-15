interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center rounded font-bold text-white text-xs"
        style={{ width: size, height: size, backgroundColor: "#006c4a" }}
      >
        C
      </div>
      <span className="font-bold tracking-tight text-on-surface" style={{ fontSize: size * 0.5 }}>
        Campus Connect
      </span>
    </div>
  );
}