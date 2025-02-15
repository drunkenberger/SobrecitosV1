import { useTranslation } from 'react-i18next';

export function useTranslations() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: 'en' | 'es') => {
    i18n.changeLanguage(language);
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language as 'en' | 'es',
  };
}

// Type definitions for translation keys
export type TranslationKey =
  | 'common.welcome'
  | 'common.loading'
  | 'common.error'
  | 'common.save'
  | 'common.cancel'
  | 'common.delete'
  | 'common.edit'
  | 'common.create'
  | 'common.search'
  | 'common.settings'
  | 'common.profile'
  | 'common.logout'
  | 'common.login'
  | 'common.register'
  | 'common.dashboard'
  | 'common.help'
  | 'navigation.home'
  | 'navigation.budget'
  | 'navigation.expenses'
  | 'navigation.reports'
  | 'navigation.blog'; 