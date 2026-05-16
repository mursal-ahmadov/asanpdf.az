type Props = { className?: string };

export default function Logo({ className = "w-8 h-8" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="asanpdf-logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#asanpdf-logo-bg)" />
      {/* Document body */}
      <path d="M20 14 H38 L46 22 V50 H20 Z" fill="white" />
      {/* Folded corner */}
      <path d="M38 14 V22 H46 Z" fill="white" opacity="0.55" />
      <path
        d="M38 14 V22 H46"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.2"
        opacity="0.4"
      />
      {/* Text lines inside document */}
      <rect x="25" y="30" width="16" height="2.6" rx="1.3" fill="#3b82f6" />
      <rect x="25" y="36" width="16" height="2.6" rx="1.3" fill="#3b82f6" />
      <rect x="25" y="42" width="10" height="2.6" rx="1.3" fill="#3b82f6" />
    </svg>
  );
}
