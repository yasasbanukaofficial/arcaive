"use client";

import React from "react";
import { MapPin } from "lucide-react";
import countries from "world-countries";

interface LocationDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationDropdown({
  value,
  onChange,
}: LocationDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(value);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const locationOptions = React.useMemo(() => {
    const options = countries.map((country) => ({
      label: country.name.common,
      value: country.name.common,
      flag: country.flag,
    }));
    options.sort((a, b) => a.label.localeCompare(b.label));
    options.unshift({ label: "Remote", value: "Remote", flag: "🌍" });
    options.unshift({ label: "Any Location", value: "", flag: "🗺️" });
    return options;
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return locationOptions;
    const lower = search.toLowerCase();
    return locationOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lower),
    );
  }, [search, locationOptions]);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOpen(true);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setSearch(val);
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative flex items-center gap-3 px-5 py-3.5 rounded-xl transition-colors duration-200 hover:bg-[var(--d-surface-hover)] min-w-[200px]"
    >
      <MapPin
        className="w-4.5 h-4.5 shrink-0"
        style={{ color: "var(--d-icon)" }}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Work location"
        value={search}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="bg-transparent outline-none w-full text-[14px] font-medium placeholder:text-[var(--d-text-ghost)]"
        style={{ color: "var(--d-text-primary)" }}
        autoComplete="off"
      />

      {open && filteredOptions.length > 0 && (
        <div
          className="absolute left-0 top-full mt-2 w-full rounded-xl z-50 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          style={{
            backgroundColor: "var(--d-surface)",
            border: "1px solid var(--d-border)",
            boxShadow: "0 12px 40px rgba(2,6,23,0.18)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex flex-col">
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="text-left px-4 py-3 transition-colors duration-150 hover:bg-[var(--d-surface-hover)] flex items-center gap-3"
                style={{ color: "var(--d-text-secondary)" }}
              >
                <span className="text-[16px]">{opt.flag}</span>
                <span className="block text-[14px] font-medium">
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
