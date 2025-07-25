import React, { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import {
  Keyboard as KeyboardIcon,
} from "lucide-react";

const VirtualKeyboard = ({ onKeyPress, onChangeAll, inputValue }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [layoutName, setLayoutName] = useState("default");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Define keyboard layouts for different languages
  const getKeyboardLayout = () => {
    switch (language) {
      case "hindi":
        return {
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            "{space}",
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M < > ? {shift}",
            "{space}",
          ],
          hindi: [
            "` १ २ ३ ४ ५ ६ ७ ८ ९ ० - ृ {bksp}",
            "{tab} ौ ै ा ी ू ब ह ग द ज ड़ ़ \\",
            "{lock} ो े ् ि ु प र क त च ट {enter}",
            "{shift} ं म न व ल स य भ , . / {shift}",
            "{space}",
          ],
        };
      default:
        return {
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            "{space}",
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M < > ? {shift}",
            "{space}",
          ],
        };
    }
  };

  // Update layout when language changes
  useEffect(() => {
    if (language === "hindi") {
      setLayoutName("hindi");
    } else {
      setLayoutName("default");
    }
  }, [language]);

  const handleShift = () => {
    setLayoutName(layoutName === "shift" ? "default" : "shift");
  };

  const onKeyPressHandler = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    } else {
      onKeyPress(button);
    }
  };

  // Update keyboard value when inputValue changes from parent
  useEffect(() => {
    if (keyboardVisible) {
      // This ensures the keyboard's internal state stays in sync with the input field
      const keyboard = document.querySelector(".simple-keyboard");
      if (keyboard && keyboard.keyboard) {
        // Use the keyboard instance's setInput method to update the internal value
        keyboard.keyboard.setInput(inputValue);
      }
    }
  }, [inputValue, keyboardVisible]);

  const toggleKeyboard = () => {
    setKeyboardVisible(!keyboardVisible);
  };

  return (
    <div className="virtual-keyboard-container">
      <button
        onClick={toggleKeyboard}
        className="keyboard-toggle-btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-lg text-sm mb-2 ml-2"
      >
        <KeyboardIcon className="h-6 w-6 text-gray-600 mr-2" />
        {/* {keyboardVisible ? t.hideKeyboard : t.showKeyboard} */}
      </button>

      {keyboardVisible && (
        <div className="keyboard-wrapper">
          <Keyboard
            layoutName={layoutName}
            layout={getKeyboardLayout()}
            onChange={onChangeAll}
            onKeyPress={onKeyPressHandler}
            inputName="default"
            theme={"hg-theme-default hg-layout-default myTheme"}
            buttonTheme={[
              {
                class: "hg-red",
                buttons: "{close}",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default VirtualKeyboard;
