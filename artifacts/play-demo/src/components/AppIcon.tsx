export default function AppIcon({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2c2c2e" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
        <radialGradient id="ringGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8e8e93" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3a3a3c" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {/* Outer shadow glow */}
      <circle cx="100" cy="100" r="97" fill="rgba(0,0,0,0.5)" />

      {/* Main background circle */}
      <circle cx="100" cy="100" r="94" fill="url(#bgGrad)" />

      {/* Concentric rings — outermost to innermost */}
      <circle cx="100" cy="100" r="93" fill="none" stroke="url(#ringGrad)" strokeWidth="1.2" opacity="0.6" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="url(#ringGrad)" strokeWidth="1.0" opacity="0.5" />
      <circle cx="100" cy="100" r="75" fill="none" stroke="url(#ringGrad)" strokeWidth="0.9" opacity="0.45" />
      <circle cx="100" cy="100" r="66" fill="none" stroke="url(#ringGrad)" strokeWidth="0.8" opacity="0.4" />

      {/* Inner dark disc */}
      <circle cx="100" cy="100" r="60" fill="#111113" />

      {/* Inner disc subtle highlight ring */}
      <circle cx="100" cy="100" r="59" fill="none" stroke="#48484a" strokeWidth="0.8" opacity="0.5" />

      {/* Play triangle — white, slightly offset right for optical centering */}
      <polygon
        points="86,70 86,130 138,100"
        fill="white"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}
      />
    </svg>
  );
}
