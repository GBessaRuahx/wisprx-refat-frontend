import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { messages } from './languages';

const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'pt' : 'pt';

i18n.use(initReactI18next).init({
  debug: process.env.NODE_ENV === 'development',
  defaultNS: ['translations'],
  fallbackLng: 'pt',
  ns: ['translations'],
  resources: messages,
  lng: savedLanguage,
});

export const changeLanguage = (language: string) => {
  i18n.changeLanguage(language);
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', language);
  }
};

export { i18n };
