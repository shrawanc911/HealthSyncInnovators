import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import LanguageSelectorModal from "./components/LanguageSelectorModal";
import ChatInterface from "./components/ChatInterface";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from "./components/Dashboard";
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
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          <Route path="/chat-bot" element={<AppContent/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
        {/* <AppContent /> */}
      </LanguageProvider>

    </BrowserRouter>
  );
}

export default App;
