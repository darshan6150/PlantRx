import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TextSize = "small" | "medium" | "large" | "xl";

interface TextSizeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

const TEXT_SIZE_MAP: Record<TextSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
  xl: "20px",
};

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("plantrx-text-size");
      return (saved as TextSize) || "medium";
    }
    return "medium";
  });

  useEffect(() => {
    localStorage.setItem("plantrx-text-size", textSize);
    document.documentElement.style.fontSize = TEXT_SIZE_MAP[textSize];
  }, [textSize]);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
  };

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const context = useContext(TextSizeContext);
  if (context === undefined) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
}
