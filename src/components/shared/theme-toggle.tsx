"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`h-9 w-9 rounded-md border border-neutral-200 dark:border-neutral-800 flex items-center justify-center opacity-60 ${className}`}
        disabled
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`h-9 w-9 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center text-neutral-700 dark:text-neutral-200 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-brand-harvest transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-brand-forest transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
