import { createContext, useState, useContext, useEffect, ReactNode } from "react";

type ThemeColor = {
  name: string;
  primary: string;
  accent: string;
};

type ThemeContextType = {
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  themeOptions: ThemeColor[];
};

// Available theme options
const themeOptions: ThemeColor[] = [
  { name: "Gold", primary: "#FFD700", accent: "#F2A900" },
  { name: "Green", primary: "#10B981", accent: "#059669" },
  { name: "Blue", primary: "#3B82F6", accent: "#2563EB" },
  { name: "Purple", primary: "#8B5CF6", accent: "#7C3AED" },
  { name: "Pink", primary: "#EC4899", accent: "#DB2777" },
];

const defaultTheme = themeOptions[0]; // Gold theme is default

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(defaultTheme);

  // Load saved theme preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("boxpacksla-theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        if (parsedTheme && parsedTheme.name && parsedTheme.primary && parsedTheme.accent) {
          setCurrentTheme(parsedTheme);
          applyTheme(parsedTheme);
        }
      } catch (e) {
        console.error("Error parsing saved theme", e);
        // Use default theme if saved theme is corrupted
        applyTheme(defaultTheme);
      }
    } else {
      // Use default theme if no saved preference
      applyTheme(defaultTheme);
    }
  }, []);

  // Apply theme to CSS custom properties
  const applyTheme = (theme: ThemeColor) => {
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--accent", theme.accent);
  };

  // Set theme and save preference to localStorage
  const setTheme = (theme: ThemeColor) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem("boxpacksla-theme", JSON.stringify(theme));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeOptions,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}