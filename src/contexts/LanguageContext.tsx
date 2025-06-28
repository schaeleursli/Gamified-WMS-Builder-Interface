import React, { useEffect, useState, createContext, useContext } from 'react';
type Language = 'en' | 'es' | 'fr';
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
const translations: Translations = {
  en: {
    'app.title': 'WMS Builder',
    'app.mission': 'Mission: Complete your WMS with all required information',
    'step.continue': 'Continue',
    'step.complete': 'Complete',
    'risk.assessment': 'Risk Assessment',
    'equipment.title': 'Equipment Assignment',
    'xp.earned': 'You earned {0} XP!',
    'mission.complete': 'Mission Complete!'
  },
  es: {
    'app.title': 'Constructor de WMS',
    'app.mission': 'Misión: Completa tu WMS con toda la información requerida',
    'step.continue': 'Continuar',
    'step.complete': 'Completar',
    'risk.assessment': 'Evaluación de Riesgos',
    'equipment.title': 'Asignación de Equipos',
    'xp.earned': '¡Ganaste {0} XP!',
    'mission.complete': '¡Misión Completa!'
  },
  fr: {
    'app.title': 'Constructeur WMS',
    'app.mission': 'Mission: Complétez votre WMS avec toutes les informations requises',
    'step.continue': 'Continuer',
    'step.complete': 'Terminer',
    'risk.assessment': 'Évaluation des Risques',
    'equipment.title': 'Affectation des Équipements',
    'xp.earned': 'Vous avez gagné {0} XP!',
    'mission.complete': 'Mission Accomplie!'
  }
};
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
}
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: key => key
});
export const useLanguage = () => useContext(LanguageContext);
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [language, setLanguage] = useState<Language>('en');
  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('wms_language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage as Language);
    }
  }, []);
  // Save language preference
  useEffect(() => {
    localStorage.setItem('wms_language', language);
  }, [language]);
  // Translation function
  const t = (key: string, ...args: any[]): string => {
    const translation = translations[language][key] || key;
    // Replace placeholders with arguments
    if (args.length) {
      return args.reduce((str, arg, i) => {
        return str.replace(`{${i}}`, arg);
      }, translation);
    }
    return translation;
  };
  return <LanguageContext.Provider value={{
    language,
    setLanguage,
    t
  }}>
      {children}
    </LanguageContext.Provider>;
};