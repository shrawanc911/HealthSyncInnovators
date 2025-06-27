import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import 'regenerator-runtime/runtime';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const AudioRecorder = forwardRef(({ onTranscriptChange }, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useContinuous, setUseContinuous] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];
  const keepAliveRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Sync transcript with parent
  useEffect(() => {
    if (transcript) onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listening) SpeechRecognition.stopListening();
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    };
  }, [listening]);

  // Initialize continuous mode based on browser
  useEffect(() => {
    const isAndroidChrome = /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent);
    setUseContinuous(!isAndroidChrome);
  }, []);

  // Sync listening state and handle non-continuous mode
  useEffect(() => {
    if (isListening !== listening) {
      setIsListening(listening);
      setIsLoading(false);
    }

    if (isListening && !listening && !useContinuous && isMobileBrowser()) {
      setTimeout(() => {
        if (isListening && !listening) {
          startRecognition();
        }
      }, 300);
    }
  }, [listening, isListening, useContinuous]);

  const isMobileBrowser = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const startRecognition = async () => {
    setIsLoading(true);
    try {
      if (listening) {
        await SpeechRecognition.stopListening();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const speechLanguage = language === 'hindi' ? 'hi-IN' : 'en-US';
      await SpeechRecognition.startListening({
        continuous: useContinuous,
        language: speechLanguage,
        interimResults: true,
      });

      if (!useContinuous && isMobileBrowser()) {
        SpeechRecognition.getRecognition().onend = () => {
          if (isListening && !listening) {
            setTimeout(startRecognition, 300);
          }
        };
      }

      keepAliveRef.current = setInterval(() => {
        if (isListening && !listening && useContinuous) {
          startRecognition();
        }
      }, 3000);

      setTimeout(() => setIsLoading(false), 3000);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setIsLoading(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    setIsLoading(false);
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
    await SpeechRecognition.stopListening();
    await new Promise(resolve => setTimeout(resolve, 300));
    if (listening) await SpeechRecognition.stopListening();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setIsListening(true);
      startRecognition();
    }
  };

  useImperativeHandle(ref, () => ({
    resetTranscript: () => {
      stopListening();
      resetTranscript();
    },
  }));

  if (!browserSupportsSpeechRecognition) {
    console.warn(t.browserNotSupported);
    return null;
  }

  if (!isMicrophoneAvailable) {
    alert(t.microphoneNotAvailable);
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      className={`rounded-full p-3 w-12 h-12 flex items-center justify-center transition-colors shadow-md hover:shadow-lg ${
        isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'
      }`}
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
});

export default AudioRecorder;