import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for language
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language detection function
// This is a basic implementation that detects the script used in the text
export const detectLanguage = (text) => {
  if (!text || text.trim() === '') return null;
  
  // Define character ranges for different scripts
  const scripts = {
    english: /^[\u0000-\u007F\s]+$/, // Basic Latin (English)
    devanagari: /[\u0900-\u097F]/, // Devanagari script (used by both Hindi and Marathi)
  };

  // Check which script the text matches
  // For English, we need to make sure the ENTIRE text is in the English script
  if (scripts.english.test(text)) {
    console.log('Detected English script');
    return 'english';
  }
  
  // For Hindi/Marathi, we check if ANY part of the text contains Devanagari script
  if (scripts.devanagari.test(text)) {
    console.log('Detected Devanagari script');
    
    // Since we can't easily distinguish between Hindi and Marathi (they use the same script),
    // we'll return the current language if it's one of these two, otherwise default to Hindi
    const currentLanguage = document.documentElement.lang;
    
    if (currentLanguage === 'marathi') {
      console.log('Current language is Marathi, maintaining it');
      return 'marathi';
    }
    
    console.log('Defaulting to Hindi for Devanagari script');
    return 'hindi';
  }
  
  console.log('Unknown script detected');
  return null; // Unknown language
};

// Provider component to wrap the app and provide language context
export const LanguageProvider = ({ children }) => {
  // State to track the current language
  const [language, setLanguage] = useState(null);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(language === null);

  // Update document language when component mounts or language changes
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
      console.log(`LanguageContext: Language set to: ${language}, updated document.documentElement.lang`);
      
      // Also set the lang attribute on the html element for better browser support
      document.querySelector('html').setAttribute('lang', 
        language === 'english' ? 'en' : 
        language === 'hindi' ? 'hi' : 
        language === 'marathi' ? 'mr' : 'en'
      );
    }
  }, [language]);

  // Function to change the language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setIsLanguageSelectorOpen(false);
  };

  // Function to open language selector modal
  const openLanguageSelector = () => {
    setIsLanguageSelectorOpen(true);
  };
  
  // Function to close language selector modal
  const closeLanguageSelector = () => {
    setIsLanguageSelectorOpen(false);
  };

  // Value object to be provided to consumers
  const value = {
    language,
    changeLanguage,
    isLanguageSelectorOpen,
    openLanguageSelector,
    closeLanguageSelector,
    detectLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};