import { useState, useRef, useEffect } from "react";
import { useLanguage, detectLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import {
  MessageSquare,
  Languages,
  AlertTriangle,
  Cpu,
  User,
  Send,
} from "lucide-react";

const ChatInterface = () => {
  const { language, openLanguageSelector } = useLanguage();
  const t = translations[language];

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [languageError, setLanguageError] = useState(false);
  const messagesEndRef = useRef(null);

  // Update the greeting message when language changes
  useEffect(() => {
    if (language && messages.length > 0) {
      setMessages([
        {
          sender: "bot",
          text: translations[language].chatbotGreeting,
        },
      ]);
    }
  }, [language]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const detectedLanguage = detectLanguage(input);

    if (detectedLanguage && detectedLanguage !== language) {
      setLanguageError(true);

      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: `It seems you're typing in ${detectedLanguage}. Please use ${language} or return to language selection.`,
        },
      ]);

      setInput("");
      return;
    }

    if (languageError) {
      setLanguageError(false);
    }

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${t.chatbotGreeting} (${language})`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            {t.welcome}
          </h1>
          <button
            onClick={openLanguageSelector}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors shadow-md cursor-pointer"
          >
            <Languages className="h-4 w-4 mr-2" />
            {t.changeLanguage}
          </button>
        </div>
      </header>

      {/* Language error */}
      {languageError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                It seems you're typing in a different language. Please use{" "}
                {language} or
                <button
                  onClick={openLanguageSelector}
                  className="ml-1 font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  {t.returnToSelection}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "bot" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mr-2 mt-1">
                <Cpu className="h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow-sm ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                  : message.sender === "system"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              {message.text}
            </div>
            {message.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ml-2 mt-1">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white shadow-md">
        <div className="container mx-auto max-w-4xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.chatPlaceholder}
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-3 w-14 h-14 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
