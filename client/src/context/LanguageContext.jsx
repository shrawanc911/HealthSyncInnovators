import { createContext, useState, useContext } from 'react';

// Create a context for language
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Simple language detection function
// This is a basic implementation - in a production app, you would use a more sophisticated approach
export const detectLanguage = (text) => {
  if (!text) return null;
  
  // Define character ranges for different scripts
  const scripts = {
    english: /^[\u0000-\u007F\s]+$/, // Basic Latin (English)
    hindi: /[\u0900-\u097F]/, // Devanagari (Hindi)
    marathi: /[\u0900-\u097F]/, // Marathi also uses Devanagari script
  };

  // Check which script the text matches
  if (scripts.english.test(text)) return 'english';
  if (scripts.hindi.test(text)) return 'hindi';
  if (scripts.marathi.test(text)) {
    // Note: This is a simplification. In reality, distinguishing between Hindi and Marathi
    // would require more sophisticated analysis since they share the same script.
    return 'marathi';
  }
  
  return null; // Unknown language
};

// Provider component to wrap the app and provide language context
export const LanguageProvider = ({ children }) => {
  // State to track the current language
  const [language, setLanguage] = useState(null);
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(language === null);

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