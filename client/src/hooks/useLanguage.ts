import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRtl: boolean;
  isActive: boolean;
}

interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (languageCode: string) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguageState] = useState(() => {
    const stored = localStorage.getItem("plantrx-language");
    if (stored) return stored;
    
    const browserLang = navigator.language.split("-")[0];
    const supportedLanguages = ["en", "ar", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "hi"];
    return supportedLanguages.includes(browserLang) ? browserLang : "en";
  });

  const { data: languages } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });

  const currentLanguageData = languages?.find(lang => lang.code === currentLanguage);
  const isRtl = currentLanguageData?.isRtl || false;

  const setCurrentLanguage = (languageCode: string) => {
    setCurrentLanguageState(languageCode);
    localStorage.setItem("plantrx-language", languageCode);
    
    document.documentElement.dir = languages?.find(lang => lang.code === languageCode)?.isRtl ? "rtl" : "ltr";
    document.documentElement.lang = languageCode;
  };

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRtl]);

  const contextValue = {
    currentLanguage: currentLanguage,
    setCurrentLanguage: setCurrentLanguage,
    isRtl: isRtl
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
