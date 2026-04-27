"use client";

import React, { useCallback, useRef } from "react";

type SliderProps = {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  valueSuffix?: string;
  hint?: string;
  className?: string;
};

export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = true,
  valueSuffix = "%",
  hint,
  className = "",
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      const updateValue = (clientX: number) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const raw = min + ratio * (max - min);
        const stepped = Math.round(raw / step) * step;
        const clamped = Math.max(min, Math.min(max, stepped));
        onChange(clamped);
      };

      updateValue(e.clientX);

      const onMove = (ev: PointerEvent) => updateValue(ev.clientX);
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [disabled, min, max, step, onChange],
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-4">
          {label && (
            <label className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
              {label}
            </label>
          )}
          {showValue && (
            <span className="font-mono text-[13px] font-bold text-[var(--text-primary)]">
              {value}{valueSuffix}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className={`
          relative w-full h-8 flex items-center select-none
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div
          className="absolute inset-x-0 h-[2px] bg-[#E8E6DE]"
          style={{ borderRadius: 0 }}
        />
        <div
          className="absolute left-0 h-[2px] bg-black transition-[width] duration-75 ease-out"
          style={{
            width: `${percentage}%`,
            borderRadius: 0,
          }}
        />
        <div
          className="absolute w-2 h-5 bg-black -translate-x-1/2 transition-[left] duration-75 ease-out"
          style={{
            left: `${percentage}%`,
            borderRadius: 0,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label={label}
        />
      </div>

      {hint && (
        <p className="font-mono text-[10px] text-[var(--text-secondary)] mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}
