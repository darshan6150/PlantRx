// Comprehensive Translation Seeding System for PlantRx
import { db } from './db';
import { translations, languages } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

export interface TranslationData {
  key: string;
  value: string;
  language: string;
  category: string;
}

// Core translation data for 12 languages
const coreTranslations: TranslationData[] = [
  // Navigation
  { key: 'nav.home', value: 'Home', language: 'en', category: 'navigation' },
  { key: 'nav.home', value: 'Inicio', language: 'es', category: 'navigation' },
  { key: 'nav.home', value: 'Accueil', language: 'fr', category: 'navigation' },
  { key: 'nav.home', value: 'Startseite', language: 'de', category: 'navigation' },
  { key: 'nav.home', value: 'Casa', language: 'it', category: 'navigation' },
  { key: 'nav.home', value: 'Início', language: 'pt', category: 'navigation' },
  { key: 'nav.home', value: 'Главная', language: 'ru', category: 'navigation' },
  { key: 'nav.home', value: '首页', language: 'zh', category: 'navigation' },
  { key: 'nav.home', value: 'ホーム', language: 'ja', category: 'navigation' },
  { key: 'nav.home', value: '홈', language: 'ko', category: 'navigation' },
  { key: 'nav.home', value: 'الصفحة الرئيسية', language: 'ar', category: 'navigation' },
  { key: 'nav.home', value: 'मुख्य पृष्ठ', language: 'hi', category: 'navigation' },

  { key: 'nav.remedies', value: 'Remedies', language: 'en', category: 'navigation' },
  { key: 'nav.remedies', value: 'Remedios', language: 'es', category: 'navigation' },
  { key: 'nav.remedies', value: 'Remèdes', language: 'fr', category: 'navigation' },
  { key: 'nav.remedies', value: 'Heilmittel', language: 'de', category: 'navigation' },
  { key: 'nav.remedies', value: 'Rimedi', language: 'it', category: 'navigation' },
  { key: 'nav.remedies', value: 'Remédios', language: 'pt', category: 'navigation' },
  { key: 'nav.remedies', value: 'Средства', language: 'ru', category: 'navigation' },
  { key: 'nav.remedies', value: '药方', language: 'zh', category: 'navigation' },
  { key: 'nav.remedies', value: '薬草療法', language: 'ja', category: 'navigation' },
  { key: 'nav.remedies', value: '치료법', language: 'ko', category: 'navigation' },
  { key: 'nav.remedies', value: 'العلاجات', language: 'ar', category: 'navigation' },
  { key: 'nav.remedies', value: 'उपचार', language: 'hi', category: 'navigation' },

  // Common phrases
  { key: 'common.welcome', value: 'Welcome to PlantRx', language: 'en', category: 'common' },
  { key: 'common.welcome', value: 'Bienvenido a PlantRx', language: 'es', category: 'common' },
  { key: 'common.welcome', value: 'Bienvenue sur PlantRx', language: 'fr', category: 'common' },
  { key: 'common.welcome', value: 'Willkommen bei PlantRx', language: 'de', category: 'common' },
  { key: 'common.welcome', value: 'Benvenuto in PlantRx', language: 'it', category: 'common' },
  { key: 'common.welcome', value: 'Bem-vindo ao PlantRx', language: 'pt', category: 'common' },
  { key: 'common.welcome', value: 'Добро пожаловать в PlantRx', language: 'ru', category: 'common' },
  { key: 'common.welcome', value: '欢迎来到PlantRx', language: 'zh', category: 'common' },
  { key: 'common.welcome', value: 'PlantRxへようこそ', language: 'ja', category: 'common' },
  { key: 'common.welcome', value: 'PlantRx에 오신 것을 환영합니다', language: 'ko', category: 'common' },
  { key: 'common.welcome', value: 'مرحباً بك في PlantRx', language: 'ar', category: 'common' },
  { key: 'common.welcome', value: 'PlantRx में आपका स्वागत है', language: 'hi', category: 'common' },

  // Remedy categories
  { key: 'category.digestive', value: 'Digestive Health', language: 'en', category: 'remedies' },
  { key: 'category.digestive', value: 'Salud Digestiva', language: 'es', category: 'remedies' },
  { key: 'category.digestive', value: 'Santé Digestive', language: 'fr', category: 'remedies' },
  { key: 'category.digestive', value: 'Verdauungsgesundheit', language: 'de', category: 'remedies' },
  { key: 'category.digestive', value: 'Salute Digestiva', language: 'it', category: 'remedies' },
  { key: 'category.digestive', value: 'Saúde Digestiva', language: 'pt', category: 'remedies' },
  { key: 'category.digestive', value: 'Здоровье пищеварения', language: 'ru', category: 'remedies' },
  { key: 'category.digestive', value: '消化健康', language: 'zh', category: 'remedies' },
  { key: 'category.digestive', value: '消化器の健康', language: 'ja', category: 'remedies' },
  { key: 'category.digestive', value: '소화 건강', language: 'ko', category: 'remedies' },
  { key: 'category.digestive', value: 'صحة الجهاز الهضمي', language: 'ar', category: 'remedies' },
  { key: 'category.digestive', value: 'पाचन स्वास्थ्य', language: 'hi', category: 'remedies' },

  { key: 'category.immune', value: 'Immune Support', language: 'en', category: 'remedies' },
  { key: 'category.immune', value: 'Apoyo Inmunológico', language: 'es', category: 'remedies' },
  { key: 'category.immune', value: 'Soutien Immunitaire', language: 'fr', category: 'remedies' },
  { key: 'category.immune', value: 'Immununterstützung', language: 'de', category: 'remedies' },
  { key: 'category.immune', value: 'Supporto Immunitario', language: 'it', category: 'remedies' },
  { key: 'category.immune', value: 'Suporte Imunológico', language: 'pt', category: 'remedies' },
  { key: 'category.immune', value: 'Поддержка иммунитета', language: 'ru', category: 'remedies' },
  { key: 'category.immune', value: '免疫支持', language: 'zh', category: 'remedies' },
  { key: 'category.immune', value: '免疫サポート', language: 'ja', category: 'remedies' },
  { key: 'category.immune', value: '면역 지원', language: 'ko', category: 'remedies' },
  { key: 'category.immune', value: 'دعم المناعة', language: 'ar', category: 'remedies' },
  { key: 'category.immune', value: 'प्रतिरक्षा सहायता', language: 'hi', category: 'remedies' },

  // Actions
  { key: 'action.search', value: 'Search', language: 'en', category: 'actions' },
  { key: 'action.search', value: 'Buscar', language: 'es', category: 'actions' },
  { key: 'action.search', value: 'Rechercher', language: 'fr', category: 'actions' },
  { key: 'action.search', value: 'Suchen', language: 'de', category: 'actions' },
  { key: 'action.search', value: 'Cerca', language: 'it', category: 'actions' },
  { key: 'action.search', value: 'Pesquisar', language: 'pt', category: 'actions' },
  { key: 'action.search', value: 'Поиск', language: 'ru', category: 'actions' },
  { key: 'action.search', value: '搜索', language: 'zh', category: 'actions' },
  { key: 'action.search', value: '検索', language: 'ja', category: 'actions' },
  { key: 'action.search', value: '검색', language: 'ko', category: 'actions' },
  { key: 'action.search', value: 'بحث', language: 'ar', category: 'actions' },
  { key: 'action.search', value: 'खोजें', language: 'hi', category: 'actions' }
];

// Language configurations
const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export async function seedLanguages(): Promise<{ success: boolean; seeded: number; errors?: string[] }> {
  try {
    console.log('Seeding languages...');
    let seededCount = 0;
    const errors: string[] = [];

    for (const lang of supportedLanguages) {
      try {
        await db.insert(languages).values({
          code: lang.code,
          name: lang.name,
          nativeName: lang.nativeName,
          isActive: true
        }).onConflictDoNothing();
        seededCount++;
      } catch (error) {
        errors.push(`Failed to seed language ${lang.code}: ${error}`);
      }
    }

    return { success: errors.length === 0, seeded: seededCount, errors: errors.length > 0 ? errors : undefined };
  } catch (error) {
    return { success: false, seeded: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] };
  }
}

export async function seedTranslations(): Promise<{ success: boolean; seeded: number; errors?: string[] }> {
  try {
    console.log('Seeding translations...');
    let seededCount = 0;
    const errors: string[] = [];

    for (const translation of coreTranslations) {
      try {
        await db.insert(translations).values({
          key: translation.key,
          value: translation.value,
          language: translation.language,
          category: translation.category
        }).onConflictDoUpdate({
          target: [translations.key, translations.language],
          set: {
            value: translation.value,
            category: translation.category
          }
        });
        seededCount++;
      } catch (error) {
        errors.push(`Failed to seed translation ${translation.key}-${translation.language}: ${error}`);
      }
    }

    return { success: errors.length === 0, seeded: seededCount, errors: errors.length > 0 ? errors : undefined };
  } catch (error) {
    return { success: false, seeded: 0, errors: [error instanceof Error ? error.message : 'Unknown error'] };
  }
}

export async function seedComprehensiveTranslations(): Promise<{ 
  languages: { success: boolean; seeded: number; errors?: string[] };
  translations: { success: boolean; seeded: number; errors?: string[] };
}> {
  console.log('Starting comprehensive translation seeding...');
  
  const languageResults = await seedLanguages();
  console.log(`Languages: ${languageResults.seeded} seeded`);
  
  const translationResults = await seedTranslations();
  console.log(`Translations: ${translationResults.seeded} seeded`);

  return {
    languages: languageResults,
    translations: translationResults
  };
}

export async function getTranslation(key: string, language: string = 'en'): Promise<string> {
  try {
    const result = await db
      .select({ value: translations.value })
      .from(translations)
      .where(and(eq(translations.key, key), eq(translations.language, language)))
      .limit(1);

    return result[0]?.value || key;
  } catch (error) {
    console.error(`Failed to get translation for ${key}-${language}:`, error);
    return key;
  }
}

export async function addTranslation(key: string, value: string, language: string, category: string = 'general'): Promise<boolean> {
  try {
    await db.insert(translations).values({
      key,
      value,
      language,
      category
    }).onConflictDoUpdate({
      target: [translations.key, translations.language],
      set: { value, category }
    });
    return true;
  } catch (error) {
    console.error('Failed to add translation:', error);
    return false;
  }
}

export default {
  seedLanguages,
  seedTranslations,
  seedComprehensiveTranslations,
  getTranslation,
  addTranslation,
  supportedLanguages,
  coreTranslations
};