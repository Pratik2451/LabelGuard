import React from 'react';

/**
 * Modern, institutional SVG emblem for LabelGuard.
 * Combines packaged commodity label geometry with an authoritative regulatory seal.
 */
export default function LabelGuardLogo({ size = 32, color = 'var(--primary)', textColor = 'var(--text-primary)', showText = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer Package Container Outline */}
        <rect
          x="3"
          y="4"
          width="30"
          height="28"
          rx="6"
          stroke={color}
          strokeWidth="2.5"
          fill="#0f172a"
        />
        {/* Package Fold / Flap Accent */}
        <path
          d="M3 12H33"
          stroke={color}
          strokeWidth="1.75"
          strokeDasharray="2 2"
          opacity="0.6"
        />
        {/* Center Verification Check & Measuring Caliper Accent */}
        <path
          d="M12 21L16 25L24 16"
          stroke="#38bdf8"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Optical Alignment Reticles */}
        <circle cx="8" cy="8" r="1.5" fill="#60a5fa" />
        <circle cx="28" cy="8" r="1.5" fill="#60a5fa" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            letterSpacing: '-0.3px',
            color: textColor,
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            LABELGUARD
          </span>
          <span style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontWeight: '600',
            letterSpacing: '0.2px'
          }}>
            Legal Metrology Inspector
          </span>
        </div>
      )}
    </div>
  );
}

