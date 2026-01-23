import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation, useLanguagePreference } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const { languages } = useTranslation();
  const { setLanguagePreference, isUpdating } = useLanguagePreference();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setLanguagePreference(languageCode);
    setIsOpen(false);
  };

  if (!languages.length) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          data-testid="language-selector-trigger"
        >
          <Globe className="h-4 w-4" />
          {currentLanguageData && (
            <>
              <span className="text-lg leading-none">{currentLanguageData.flag}</span>
              <span className="text-sm font-medium hidden sm:block">
                {currentLanguageData.nativeName}
              </span>
            </>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="min-w-[200px] max-h-[400px] overflow-y-auto"
        data-testid="language-selector-dropdown"
      >
        {languages
          .filter(lang => lang.isActive)
          .map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              data-testid={`language-option-${language.code}`}
              disabled={isUpdating}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {language.nativeName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {language.name}
                  </span>
                </div>
              </div>
              
              {currentLanguage === language.code && (
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}