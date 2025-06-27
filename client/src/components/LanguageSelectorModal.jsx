import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import { MessageSquare, ChevronRight } from "lucide-react";

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
      <div className="relative p-8 bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200 z-10 animate-slideIn ">
        <p className="text-center text-gray-500 mb-8">{selectLanguage}</p>
        <div className="space-y-4">
          <button
            onClick={() => changeLanguage("english")}
            className="w-full bg-[#DAEAF7] border-2 rounded-lg py-6 font-semibold text-2xl text-[#2F82FF] border-[#2F82FF] hover:bg-[#C0D9F0] hover:border-[#1E67CC] hover:text-[#1E67CC] duration-300 cursor-pointer hover:scale-103 shadow-lg"
          >
            <span>{english}</span>
          </button>

          <button
            onClick={() => changeLanguage("hindi")}
            className="w-full bg-[#F9D1CF] border-2 rounded-lg py-6 font-semibold text-2xl text-[#C43533] border-[#C43533] backdrop-filter backdrop-blur-md bg-opacity-80 hover:bg-[#E9B9B6] hover:border-[#A12B29] hover:text-[#A12B29] duration-300 cursor-pointer hover:scale-103 shadow-lg"
          >
            <span className="">{hindi}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
