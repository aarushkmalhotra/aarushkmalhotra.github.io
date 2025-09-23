"use client";

import { useEffect, useState } from "react";

type Accent = {
  label: string;
  hsl: string; // e.g., "221 83% 53%" matches hsl(var(--primary)) format
  foreground?: string; // optional override
};

const ACCENTS: Accent[] = [
  { label: "Blue", hsl: "221 83% 53%" },
  { label: "Purple", hsl: "261 73% 60%" },
  { label: "Teal", hsl: "174 62% 45%" },
  { label: "Orange", hsl: "24 95% 53%" },
  { label: "Pink", hsl: "330 81% 60%" },
];

const STORAGE_KEY = "portfolio:accent-hsl";

function applyAccent(hsl: string, foreground?: string) {
  const root = document.documentElement;
  root.style.setProperty("--primary", hsl);
  // Default to near-white foreground for contrast
  root.style.setProperty("--primary-foreground", foreground || "0 0% 98%");
}

export function AccentPicker() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setValue(stored);
      applyAccent(stored);
    }
  }, []);

  const onPick = (hsl: string) => {
    setValue(hsl);
    localStorage.setItem(STORAGE_KEY, hsl);
    applyAccent(hsl);
  };

  return (
    <div className="flex items-center gap-2">
      {ACCENTS.map((a) => (
        <button
          key={a.hsl}
          type="button"
          aria-label={`Use ${a.label} accent`}
          onClick={() => onPick(a.hsl)}
          className={`h-5 w-5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring ${
            value === a.hsl ? "ring-2 ring-ring" : ""
          }`}
          style={{ backgroundColor: `hsl(${a.hsl})` }}
        />
      ))}
    </div>
  );
}
