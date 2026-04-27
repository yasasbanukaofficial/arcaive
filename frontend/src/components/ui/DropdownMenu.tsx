"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type DropdownProps<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  buttonClassName?: string;
};

export default function DropdownMenu<T extends string | number>({
  options,
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: DropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const focusedIndexRef = React.useRef<number>(-1);

  const [panelPos, setPanelPos] = React.useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const current = options.find((o) => o.value === value) ?? options[0];

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    if (!open) {
      focusedIndexRef.current = -1;
      return;
    }

    const reposition = () => {
      const btn = btnRef.current;
      const panel = panelRef.current;
      if (!btn || !panel) return;

      const btnRect = btn.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 12;

      let top = btnRect.bottom + 6;
      if (top + panelHeight > vh - pad && btnRect.top - panelHeight - 6 > pad) {
        top = btnRect.top - panelHeight - 6;
      }
      top = Math.max(pad, Math.min(top, vh - panelHeight - pad));

      let left = btnRect.left;
      if (left + panelWidth > vw - pad) {
        left = vw - panelWidth - pad;
      }
      left = Math.max(pad, left);

      setPanelPos({ top, left });
    };

    const frame = requestAnimationFrame(reposition);

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      focusedIndexRef.current = options.findIndex((o) => o.value === value);
      return;
    }

    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
      btnRef.current?.focus();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedIndexRef.current = Math.min(
        focusedIndexRef.current + 1,
        options.length - 1,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedIndexRef.current = Math.max(focusedIndexRef.current - 1, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const idx = focusedIndexRef.current;
      if (idx >= 0 && idx < options.length) onChange(options[idx].value);
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        className={`flex items-center justify-between gap-4 px-[14px] py-[10px] border  cursor-pointer ${buttonClassName}`}
        style={{
          backgroundColor: open ? "#F5F4EF" : "white",
          borderColor: open ? "black" : "#E8E6DE",
          color: "black",
          borderRadius: 0,
        }}
      >
        <span className="font-sans text-[13px] font-bold uppercase tracking-tight truncate">
          {current.label}
        </span>
        <span className="font-mono text-[16px] leading-none">↓</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          className="fixed min-w-[200px] w-max max-w-[calc(100vw-1.5rem)] z-[9999] max-h-[300px] overflow-y-auto bg-white border border-black"
          style={{
            top: panelPos.top,
            left: panelPos.left,
            borderRadius: 0,
          }}
          onKeyDown={onKeyDown}
        >
          <div className="flex flex-col">
            {options.map((opt, idx) => (
              <button
                key={String(opt.value)}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`text-left px-[14px] py-[10px] transition-colors border-b border-[#E8E6DE] last:border-b-0 ${
                  opt.value === value
                    ? "bg-[#F5F4EF] text-black"
                    : "bg-white hover:bg-[#F5F4EF] text-black"
                }`}
                onMouseEnter={() => (focusedIndexRef.current = idx)}
              >
                <span className="block font-sans text-[13px] font-medium uppercase tracking-tight">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
