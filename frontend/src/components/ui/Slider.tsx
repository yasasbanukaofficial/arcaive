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
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              className="block text-[13px] font-medium ml-0.5"
              style={{ color: "var(--d-text-tertiary)" }}
            >
              {label}
            </label>
          )}
          {showValue && (
            <span
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: "var(--d-text-primary)" }}
            >
              {value}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className={`
          relative w-full h-6 flex items-center select-none
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <div
          className="absolute inset-x-0 h-1.5 rounded-full"
          style={{
            backgroundColor: "var(--d-surface-active)",
            border: "1px solid var(--d-border)",
          }}
        />
        <div
          className="absolute left-0 h-1.5 rounded-full transition-[width] duration-75 ease-out"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.6))",
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full -translate-x-1/2 transition-[left] duration-75 ease-out"
          style={{
            left: `${percentage}%`,
            backgroundColor: "var(--d-text-primary)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25), 0 0 0 2px rgba(59, 130, 246, 0.2)",
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
        <p
          className="text-[12px] ml-0.5"
          style={{ color: "var(--d-text-muted)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
