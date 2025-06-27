import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import 'regenerator-runtime/runtime';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

const AudioRecorder = forwardRef(({ onTranscriptChange }, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReceivedTranscript, setHasReceivedTranscript] = useState(false);
  const [recognitionHealthCheckTimer, setRecognitionHealthCheckTimer] = useState(null);
  const [useContinuous, setUseContinuous] = useState(true);
  const [supportsContinuousListening, setSupportsContinuousListening] = useState(true);
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
      // console.log('Transcript updated:', transcript);
      onTranscriptChange(transcript);
    }
    
    // Only clean up when component unmounts, not on every transcript change
    return () => {
      if (listening) {
        // console.log('Cleaning up speech recognition on unmount');
        SpeechRecognition.stopListening();
      }
    };
  // Removed listening from dependencies to prevent re-running this effect when listening state changes
  }, [transcript, onTranscriptChange]);

  useEffect(() => {
    // Sync internal listening state with SpeechRecognition state
    // Only update isListening if it doesn't match the actual listening state
    // This prevents conflicts between our manual toggles and the library's state
    if (isListening !== listening) {
      console.log(`Syncing listening state: isListening=${isListening}, listening=${listening}`);
      
      // If the library stopped listening but our state thinks we're still listening,
      // make sure to update our state to match reality
      if (!listening && isListening) {
        console.log('Library stopped listening but our state is still listening, updating state');
        setIsListening(false);
        // Also ensure any timers are cleared
        if (recognitionHealthCheckTimer) {
          console.log('Clearing health check timer due to state mismatch');
          clearTimeout(recognitionHealthCheckTimer);
          setRecognitionHealthCheckTimer(null);
        }
        if (window.speechRecognitionKeepAlive) {
          console.log('Clearing keep-alive interval due to state mismatch');
          clearInterval(window.speechRecognitionKeepAlive);
          window.speechRecognitionKeepAlive = null;
        }
      } else if (listening && !isListening) {
        // If the library is listening but our state thinks we're not,
        // update our state to match reality
        console.log('Library is listening but our state is not, updating state');
        setIsListening(true);
      }
    }
    
    if (!listening) {
      setIsLoading(false);
      
      // If we're in non-continuous mode on mobile and we want to be listening,
      // but the browser stopped listening (common on Android Chrome),
      // we need to restart manually
      if (isListening && !supportsContinuousListening && isMobileBrowser()) {
        console.log('Browser stopped listening in non-continuous mode, restarting...');
        // Small delay to ensure the previous instance is fully stopped
        setTimeout(() => {
          if (isListening && !listening) {
            const speechLanguage = language === 'hindi' ? 'hi-IN' : 
                                  language === 'marathi' ? 'mr-IN' : 'en-US';
                                  
            SpeechRecognition.startListening({
              continuous: false, // Keep using non-continuous mode
              language: speechLanguage,
              interimResults: true
            });
          }
        }, 300);
      }
    }
  }, [listening, isListening, supportsContinuousListening, language]);
  
  useEffect(() => {
    // Track if we've received any transcript updates to detect if recognition is working
    if (transcript && listening) {
      setHasReceivedTranscript(true);
    }
  }, [transcript, listening]);
  
  // Initialize component when it's mounted
  useEffect(() => {
    console.log('AudioRecorder component mounted');
    
    // Check if browser supports speech recognition
    if (browserSupportsSpeechRecognition) {
      console.log('Browser supports speech recognition');
    } else {
      console.warn('Browser does not support speech recognition');
    }
    
    // Clean up only when unmounting completely
    return () => {
      console.log('AudioRecorder component unmounting');
      
      // Clear the keep-alive interval if it exists
      if (window.speechRecognitionKeepAlive) {
        console.log('Clearing speech recognition keep-alive interval on unmount');
        clearInterval(window.speechRecognitionKeepAlive);
        window.speechRecognitionKeepAlive = null;
      }
      
      // Clear health check timer if it exists
      if (recognitionHealthCheckTimer) {
        clearTimeout(recognitionHealthCheckTimer);
      }
      
      if (listening) {
        console.log('Stopping speech recognition on unmount');
        SpeechRecognition.stopListening();
      }
    };
  }, [browserSupportsSpeechRecognition, listening, recognitionHealthCheckTimer]);
  
  // This useEffect is already defined above, so we can remove this duplicate
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    resetTranscript: () => {
      console.log('resetTranscript called from parent');
      
      // Clear the keep-alive interval if it exists
      if (window.speechRecognitionKeepAlive) {
        console.log('Clearing speech recognition keep-alive interval from resetTranscript');
        clearInterval(window.speechRecognitionKeepAlive);
        window.speechRecognitionKeepAlive = null;
      }
      
      // Clear health check timer if it exists
      if (recognitionHealthCheckTimer) {
        console.log('Clearing speech recognition health check timer from resetTranscript');
        clearTimeout(recognitionHealthCheckTimer);
        setRecognitionHealthCheckTimer(null);
      }
      
      // Force stop listening regardless of current state
      console.log('Stopping speech recognition from resetTranscript, current state:', { isListening, listening });
      // Update our internal state to match
      setIsListening(false);
      SpeechRecognition.stopListening();
      
      // Reset the transcript and health check state
      resetTranscript();
      setHasReceivedTranscript(false);
      setIsLoading(false);
    }
  }));

  // Check if browser is mobile
  const isMobileBrowser = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Initialize supportsContinuousListening state
  useEffect(() => {
    // Chrome on Android has issues with continuous listening
    const isAndroidChrome = /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent);
    const shouldUseContinuous = !isAndroidChrome;
    
    setSupportsContinuousListening(shouldUseContinuous);
    setUseContinuous(shouldUseContinuous);
    
    if (isAndroidChrome) {
      console.log('Android Chrome detected - continuous listening may be unreliable');
      console.log('Switching to non-continuous mode for better compatibility');
    }
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
      // First, make sure any existing recognition is stopped
      if (listening) {
        console.log('Stopping existing speech recognition before starting new one');
        await SpeechRecognition.stopListening();
        
        // Clear any timers that might be restarting it
        if (window.speechRecognitionKeepAlive) {
          console.log('Clearing keep-alive interval before starting new recognition');
          clearInterval(window.speechRecognitionKeepAlive);
          window.speechRecognitionKeepAlive = null;
        }
        
        if (recognitionHealthCheckTimer) {
          console.log('Clearing health check timer before starting new recognition');
          clearTimeout(recognitionHealthCheckTimer);
          setRecognitionHealthCheckTimer(null);
        }
        
        // Small delay to ensure the previous instance is fully stopped
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Double-check that it's actually stopped
        if (listening) {
          console.log('Speech recognition still active after stopping, trying again');
          await SpeechRecognition.stopListening();
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      // Set language based on the current app language
      const speechLanguage = language === 'hindi' ? 'hi-IN' : 
                            language === 'marathi' ? 'mr-IN' : 'en-US';
      
      console.log(`Starting speech recognition with language: ${speechLanguage}, continuous mode: ${useContinuous}, current app language: ${language}`);
      
      // Make sure the browser's speech recognition is using the correct language
      if (window.webkitSpeechRecognition) {
        console.log('Using webkitSpeechRecognition with language:', speechLanguage);
      }
      
      // Start listening with appropriate settings
      await SpeechRecognition.startListening({ 
        continuous: useContinuous,
        language: speechLanguage,
        interimResults: true // Enable interim results to get partial transcriptions
      });
      
      // If we're not using continuous mode on mobile, set up manual restart
      if (!useContinuous && isMobileBrowser()) {
        console.log('Using manual restart for mobile browser without continuous support');
      }
      
      // Reset transcript health check state
      setHasReceivedTranscript(false);
      
      // Set up a health check to verify speech recognition is actually working
      const healthCheckTimer = setTimeout(() => {
        if (isListening && !hasReceivedTranscript) {
          console.log('Speech recognition may not be working - no transcript received after 5 seconds');
          
          // Try to restart speech recognition with different settings
          console.log('Attempting recovery by restarting speech recognition...');
          
          // Stop current recognition
          SpeechRecognition.stopListening();
          
          // Wait a moment then restart with potentially different settings
          setTimeout(() => {
            if (isListening) {
              // Try with opposite continuous setting as a recovery mechanism
              const recoveryUseContinuous = !useContinuous;
              console.log(`Recovery attempt with continuous=${recoveryUseContinuous}`);
              
              SpeechRecognition.startListening({
                continuous: recoveryUseContinuous,
                language: speechLanguage,
                interimResults: true
              });
            }
          }, 500);
        }
      }, 5000); // Check after 5 seconds if we've received any transcript
      
      setRecognitionHealthCheckTimer(healthCheckTimer);
      
      // Set up a periodic check to restart listening if it stops unexpectedly
      const keepAliveInterval = setInterval(() => {
        // Only restart if we're supposed to be listening but the library isn't
        if (isListening && !listening) {
          console.log('Speech recognition stopped unexpectedly, restarting...');
          
          // Add a small delay before restarting to avoid potential race conditions
          setTimeout(() => {
            // Double-check that we still want to be listening
            if (isListening && !listening) {
              console.log('Attempting to restart speech recognition');
              // Use the same continuous setting as before
              SpeechRecognition.startListening({ 
                continuous: useContinuous,
                language: speechLanguage,
                interimResults: true
              });
              
              // For non-continuous mode on mobile, we need to handle end events
              if (!useContinuous && isMobileBrowser()) {
                // This will be handled by the browser's natural end event
                console.log('Restarted in non-continuous mode - will need manual restart when speech ends');
              }
            } else {
              console.log('Not restarting speech recognition - state changed:', { isListening, listening });
            }
          }, 500);
        } else if (!isListening && listening) {
          // If we're not supposed to be listening but the library is, stop it
          console.log('Speech recognition active when it should be stopped, stopping it');
          SpeechRecognition.stopListening();
        }
      }, 3000); // Check every 3 seconds
      
      // Store the interval ID in a ref so we can clear it later
      window.speechRecognitionKeepAlive = keepAliveInterval;
      
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
    console.log('stopListening called, current state:', { isListening, listening });
    
    // Clear the keep-alive interval if it exists
    if (window.speechRecognitionKeepAlive) {
      console.log('Clearing speech recognition keep-alive interval');
      clearInterval(window.speechRecognitionKeepAlive);
      window.speechRecognitionKeepAlive = null;
    }
    
    // Clear health check timer if it exists
    if (recognitionHealthCheckTimer) {
      console.log('Clearing speech recognition health check timer');
      clearTimeout(recognitionHealthCheckTimer);
      setRecognitionHealthCheckTimer(null);
    }
    
    // Make sure our internal state is updated
    setIsListening(false);
    
    // Force stop the speech recognition
    console.log('Forcefully stopping speech recognition');
    SpeechRecognition.stopListening();
    
    // Add a small delay and check if it's still listening
    setTimeout(() => {
      if (listening) {
        console.log('Speech recognition still listening after stopListening, trying again');
        SpeechRecognition.stopListening();
      }
    }, 300);
    
    setIsLoading(false);
    setHasReceivedTranscript(false);
  };

  const toggleListening = () => {
    console.log(`toggleListening called, current state: isListening=${isListening}, listening=${listening}`);
    
    if (isListening) {
      console.log('Stopping speech recognition');
      setIsListening(false); // Update state before stopping
      stopListening();
      // Keep the transcript in the input field
      
      // Double-check after a short delay to ensure it actually stopped
      setTimeout(() => {
        if (listening) {
          console.log('Speech recognition still active after toggle stop, forcing stop');
          SpeechRecognition.stopListening();
          // Clear any timers that might be restarting it
          if (window.speechRecognitionKeepAlive) {
            clearInterval(window.speechRecognitionKeepAlive);
            window.speechRecognitionKeepAlive = null;
          }
        }
      }, 500);
    } else {
      // Only reset transcript when starting new recording
      console.log('Starting speech recognition with continuous mode');
      
      // First ensure any existing recognition is stopped
      if (listening) {
        console.log('Speech recognition is already active, stopping it first');
        SpeechRecognition.stopListening();
        // Small delay to ensure it's fully stopped
        setTimeout(() => startRecognition(), 300);
      } else {
        startRecognition();
      }
    }
  };
  
  const startRecognition = () => {
    setIsListening(true); // Update state before starting
    resetTranscript();
    startListening()
      .then(() => {
        console.log('Speech recognition started successfully');
      })
      .catch((error) => {
        console.error('Error starting speech recognition:', error);
        setIsListening(false); // Reset state if there's an error
      });
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn(t.browserNotSupported);
    return null;
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
});


export default AudioRecorder;