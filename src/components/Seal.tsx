"use client";

interface SealProps {
  size?: number;
  className?: string;
}

export default function Seal({ size = 48, className = "" }: SealProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Crown */}
      <path
        d="M35 38L40 28L45 35L50 25L55 35L60 28L65 38H35Z"
        fill="currentColor"
      />
      <rect x="35" y="38" width="30" height="4" rx="1" fill="currentColor" />
      {/* Fork */}
      <path
        d="M38 50L38 65M38 50L36 45M38 50L40 45M38 50L38 45"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Spoon */}
      <path
        d="M62 50L62 65M62 50C62 50 58 48 58 52C58 56 62 54 62 54"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Crossed lines */}
      <path
        d="M38 65L62 50M62 65L38 50"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
