import React from "react";

export interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  width = 110,
  height = 28,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Icon mark — stylised signal/pulse */}
      <rect x="0" y="4" width="20" height="20" rx="4" fill="#f97316" />
      <path
        d="M6 14h2l2-4 2 8 2-6 2 4h2"
        stroke="#18181b"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark */}
      <text
        x="26"
        y="20"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Reev
      </text>
    </svg>
  );
};
