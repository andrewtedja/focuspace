"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type FontType = "Lexend" | "Open Dyslexic";

interface FontContextType {
  selectedFont: FontType;
  setSelectedFont: (font: FontType) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);
export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFont, setSelectedFont] = useState<FontType>("Lexend");

  useEffect(() => {
    document.body.classList.remove(
      "font-lexend",
      "font-open-dyslexic",
      "od-scale",
    );
    if (selectedFont === "Open Dyslexic") {
      document.body.classList.add("font-open-dyslexic", "od-scale");
    } else {
      document.body.classList.add("font-lexend");
    }
  }, [selectedFont]);

  return (
    <FontContext.Provider value={{ selectedFont, setSelectedFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = () => {
  const context = useContext(FontContext);
  if (!context)
    throw new Error("useFontContext must be used inside a FontProvider");
  return context;
};
