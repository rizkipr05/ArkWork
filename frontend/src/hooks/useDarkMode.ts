"use client";

import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [dark, setDark] = useState(false);

  // Ambil preferensi dari localStorage atau system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setDark(stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
    }
  }, []);

  // Update class <html> & simpan preferensi
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, setDark };
}
