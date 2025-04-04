import React, { createContext, useState, useContext } from 'react';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: 'en' | 'ta' | 'kn';
  setLanguage: (lang: 'en' | 'ta' | 'kn') => void;
  t: (key: string) => string;
}

const translations: { [key: string]: Translations } = {
  en: {
    appTitle: 'Farm Assistant',
    cropData: 'Crop Data',
    weatherInfo: 'Weather Information',
    diseaseCheckup: 'Plant Disease Checkup',
    pestSolution: 'Plant Pest Solution',
    yieldCheckup: 'Plant Yield Checkup',
    selectLanguage: 'Select Language',
    close: 'Close',
  },
  ta: {
    appTitle: 'பண்ணை உதவியாளர்',
    cropData: 'பயிர் தரவு',
    weatherInfo: 'வானிலை தகவல்',
    diseaseCheckup: 'தாவர நோய் பரிசோதனை',
    pestSolution: 'தாவர பூச்சி தீர்வு',
    yieldCheckup: 'தாவர விளைச்சல் பரிசோதனை',
    selectLanguage: 'மொழியை தேர்ந்தெடு',
    close: 'மூடு',
  },
  kn: {
    appTitle: 'ಕೃಷಿ ಸಹಾಯಕ',
    cropData: 'ಬೆಳೆ ಡೇಟಾ',
    weatherInfo: 'ಹವಾಮಾನ ಮಾಹಿತಿ',
    diseaseCheckup: 'ಗಿಡ ರೋಗ ಪರೀಕ್ಷೆ',
    pestSolution: 'ಗಿಡ ಕೀಟ ಪರಿಹಾರ',
    yieldCheckup: 'ಗಿಡ ಇಳುವರಿ ಪರೀಕ್ಷೆ',
    selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    close: 'ಮುಚ್ಚಿ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ta' | 'kn'>('en');

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};