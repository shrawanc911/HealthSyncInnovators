import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import LanguageSelectorModal from "./components/LanguageSelectorModal";
import ChatInterface from "./components/ChatInterface";

// Main App content that uses the language context
const AppContent = () => {
  const { language, isLanguageSelectorOpen } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Always show the chat interface if a language is selected */}
      {language && <ChatInterface />}
      
      {/* Show the language selector modal when it's open */}
      <LanguageSelectorModal isOpen={isLanguageSelectorOpen} />
    </div>
  );
};

// Main App component that provides the language context
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
