interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  const logoSize = size || 32;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center justify-center rounded font-bold text-white text-xs"
        style={{ 
          width: logoSize, 
          height: logoSize, 
          backgroundColor: 'rgb(5, 150, 105)' 
        }}
      >
        C
      </div>
      <span className="font-bold tracking-tight text-on-surface" style={{ fontSize: logoSize * 0.5 }}>
        Campus Connect
      </span>
    </div>
  );
}