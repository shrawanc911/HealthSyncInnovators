import { useState, useRef, useEffect, createRef } from "react";
import { useLanguage, detectLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import {
  MessageSquare,
  Languages,
  AlertTriangle,
  Cpu,
  User,
  Send,
  Keyboard as KeyboardIcon,
} from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import VirtualKeyboard from "./VirtualKeyboard";
import "regenerator-runtime/runtime";

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
  const audioRecorderRef = createRef();

  // Update the greeting message when language changes
  useEffect(() => {
    if (language && messages.length > 0) {
      setMessages([
        {
          sender: "bot",
          text: translations[language].chatbotGreeting,
        },
      ]);

      // Set the document language attribute to help with language detection
      document.documentElement.lang = language;
      console.log(
        `ChatInterface: Language changed to ${language}, updated document.documentElement.lang`
      );

      // Reset any language errors when changing languages
      setLanguageError(false);

      // Clear input when changing languages
      setInput("");

      // Reset audio recorder if it exists
      if (audioRecorderRef.current) {
        console.log("Resetting audio recorder after language change");
        audioRecorderRef.current.resetTranscript();
      }
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
          text: t.wrongLanguageDetected
            .replace("{detected}", translations.english[detectedLanguage])
            .replace("{current}", translations.english[language]),
        },
      ]);

      setInput("");
      return;
    }

    if (languageError) {
      setLanguageError(false);
    }
    const currentInput = input;
    setInput("");

    // Add the user message
    setMessages((prev) => [...prev, { sender: "user", text: currentInput }]);

    // Make sure to reset the audio recorder and stop listening
    if (audioRecorderRef.current) {
      console.log("Resetting audio recorder after sending message");
      // Call resetTranscript to stop listening and clear transcript
      audioRecorderRef.current.resetTranscript();

      // Double-check after a short delay to ensure it actually stopped
      setTimeout(() => {
        console.log(
          "Double-checking audio recorder state after sending message"
        );
        if (audioRecorderRef.current) {
          // Call resetTranscript again if needed
          audioRecorderRef.current.resetTranscript();
        }
      }, 1000);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t.chatbotGreeting,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-white text-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold flex items-center text-black text-opacity-90 hover:text-opacity-100 transition-opacity duration-300 font-agile">
            Triage Ai
          </h1>
          <button
            onClick={openLanguageSelector}
            className="border-gray-200 border text-black px-4 py-2 rounded-lg text-md font-medium flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-103 cursor-pointer "
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl no-scrollbar">
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
      <style>{`
  .no-scrollbar {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and other WebKit browsers */
  }
`}</style>

      {/* Input */}
      <div className=" p-4 bg-white shadow-md px-120">
        <div className="z-50 bg-white rounded-2xl p-4 backdrop-filter backdrop-blur-md bg-opacity-80 shadow-xl border border-gray-300 transition-all duration-300 hover:shadow-2xl py-6 px">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
                // Handle backspace key properly
                if (e.key === "Backspace" && input.length > 0) {
                  // Let the default behavior handle backspace
                  // but also update our state to ensure sync with virtual keyboard
                  setInput(input.slice(0, -1));
                }
              }}
              placeholder={t.chatPlaceholder}
              className="flex-1 border border-gray-300 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              lang={language === "hindi" ? "hi" : "en"}
              inputMode="text"
              autoComplete="off"
            />
            <AudioRecorder
              ref={audioRecorderRef}
              onTranscriptChange={(transcript) => setInput(transcript)}
              // Using ref instead of key to control the component
            />

            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-3 w-12 h-12 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Only show virtual keyboard for Hindi */}
          {language === "hindi" && (
            <div className="mt-2">
              <VirtualKeyboard
                onKeyPress={(button) => {
                  if (button === "{bksp}") {
                    setInput(input.slice(0, -1));
                  } else if (button === "{space}") {
                    setInput(input + " ");
                  } else if (button === "{enter}") {
                    handleSend();
                  } else if (
                    button !== "{shift}" &&
                    button !== "{lock}" &&
                    button !== "{tab}"
                  ) {
                    setInput(input + button);
                  }
                }}
                onChangeAll={(inputText) => setInput(inputText)}
                inputValue={input}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
