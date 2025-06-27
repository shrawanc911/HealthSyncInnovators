import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { MessageSquare, ChevronRight } from 'lucide-react';

const LanguageSelectorModal = ({ isOpen }) => {
  const { changeLanguage } = useLanguage();

  // Using English translations for the language selection screen
  const { selectLanguage, english, hindi } = translations.english;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className="relative p-8 bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-100 z-10 animate-slideIn">
        {/* Logo/Icon at the top */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-lg">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 mt-6 text-gray-800">Health Chat</h2>
        <p className="text-center text-gray-500 mb-8">{selectLanguage}</p>
        
        <div className="space-y-4">
          <button
            onClick={() => changeLanguage('english')}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-between group"
          >
            <span className="text-lg font-medium">{english}</span>
            <span className="bg-white bg-opacity-20 rounded-full p-2 transform group-hover:translate-x-1 transition-transform">
              <ChevronRight className="h-5 w-5" />
            </span>
          </button>
          
          <button
            onClick={() => changeLanguage('hindi')}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-between group"
          >
            <span className="text-lg font-medium">{hindi}</span>
            <span className="bg-white bg-opacity-20 rounded-full p-2 transform group-hover:translate-x-1 transition-transform">
              <ChevronRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;