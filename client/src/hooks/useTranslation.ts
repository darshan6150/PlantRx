import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "./useLanguage";

interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRtl: boolean;
  isActive: boolean;
}

interface Translation {
  id: number;
  key: string;
  languageCode: string;
  value: string;
  category: string;
}

interface TranslationResponse {
  translations: Translation[];
  languages: Language[];
}

// Hook to get translations for current language
export function useTranslation() {
  const { currentLanguage } = useLanguage();
  
  const { data: translationData, isLoading } = useQuery<TranslationResponse>({
    queryKey: ["/api/translations", currentLanguage],
    enabled: !!currentLanguage,
  });

  // Create translation lookup map
  const translations = translationData?.translations?.reduce((acc, translation) => {
    acc[translation.key] = translation.value;
    return acc;
  }, {} as Record<string, string>) || {};

  // Translation function
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  return {
    t,
    isLoading,
    currentLanguage,
    languages: translationData?.languages || [],
  };
}

// Hook to manage user language preference
export function useLanguagePreference() {
  const queryClient = useQueryClient();
  
  const setLanguagePreference = useMutation({
    mutationFn: async (languageCode: string) => {
      return apiRequest(`/api/user-language-preference`, {
        method: "POST",
        body: { languageCode },
      });
    },
    onSuccess: () => {
      // Invalidate all translation queries to refetch with new language
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-language-preference"] });
    },
  });

  return {
    setLanguagePreference: setLanguagePreference.mutate,
    isUpdating: setLanguagePreference.isPending,
  };
}