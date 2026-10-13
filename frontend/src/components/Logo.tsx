interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2549e0" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Outer circle background */}
      <circle cx="24" cy="24" r="24" fill="url(#logoGrad)" />

      {/* Node: center-left */}
      <circle cx="14" cy="24" r="4" fill="white" opacity="0.95" />
      {/* Node: top-right */}
      <circle cx="32" cy="13" r="4" fill="white" opacity="0.95" />
      {/* Node: bottom-right */}
      <circle cx="32" cy="35" r="4" fill="white" opacity="0.95" />
      {/* Node: center hub */}
      <circle cx="24" cy="24" r="5" fill="#facc15" />

      {/* Edges connecting nodes */}
      <line x1="14" y1="24" x2="24" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="24" y1="24" x2="32" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="24" y1="24" x2="32" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="32" y1="13" x2="32" y2="35" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="14" y1="24" x2="32" y2="13" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
    </svg>
  );
}
