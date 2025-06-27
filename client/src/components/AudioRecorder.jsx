import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import 'regenerator-runtime/runtime';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const AudioRecorder = ({ onTranscriptChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    // Update parent component with transcript
    if (transcript) {
      onTranscriptChange(transcript);
    }
    
    // Clean up function to stop listening when component unmounts or re-renders
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, [transcript, onTranscriptChange, listening]);

  useEffect(() => {
    // Sync internal listening state with SpeechRecognition state
    setIsListening(listening);
    if (!listening) {
      setIsLoading(false);
    }
  }, [listening]);
  
  // Reset component when it's re-mounted (due to key change in parent)
  useEffect(() => {
    // Reset states when component mounts
    setIsListening(false);
    setIsLoading(false);
    resetTranscript();
    
    // Clean up when unmounting
    return () => {
      if (listening) {
        SpeechRecognition.stopListening();
      }
    };
  }, []);

  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert(t.browserNotSupported);
      return;
    }
    
    if (!isMicrophoneAvailable) {
      alert(t.microphoneNotAvailable);
      return;
    }
    
    resetTranscript();
    setIsLoading(true);
    
    try {
      // Set language based on the current app language
      const speechLanguage = language === 'hindi' ? 'hi-IN' : 
                            language === 'marathi' ? 'mr-IN' : 'en-US';
      
      await SpeechRecognition.startListening({ 
        continuous: true,
        language: speechLanguage
      });
      
      // Set a timeout to clear the loading state if it doesn't change automatically
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsLoading(false);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsLoading(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      // Keep the transcript in the input field
    } else {
      // Only reset transcript when starting new recording
      resetTranscript();
      startListening();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn(t.browserNotSupported);
    return null; // Don't render anything if speech recognition is not supported
  }

  return (
    <button
      onClick={toggleListening}
      className={`rounded-full p-3 w-12 h-12 flex items-center justify-center transition-colors shadow-md hover:shadow-lg ${isListening 
        ? 'bg-red-500 hover:bg-red-600' 
        : 'bg-gray-200 hover:bg-gray-300'}`}
      disabled={isLoading}
      title={isListening ? t.stopRecording : t.startRecording}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 text-white animate-spin" />
      ) : isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-gray-600" />
      )}
    </button>
  );
};

export default AudioRecorder;