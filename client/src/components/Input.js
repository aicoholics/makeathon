import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import StopIcon from "@mui/icons-material/Stop";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// .env

// require("dotenv").config();

const Input = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [recognizer, setRecognizer] = useState(null);

  const handleVoiceRecognition = () => {
    setIsRecording(true);

    const key = window.prompt("Please enter your speech key:");

    if (!key) {
      setIsRecording(false);
      return;
    }

    // Creates an instance of a speech config with specified subscription key and service region.
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      key,
      "germanywestcentral"
    );
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizerInstance = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    setRecognizer(recognizerInstance);

    recognizerInstance.recognizing = (s, e) => {
      setText(text + " " + e.result.text);
    };

    recognizerInstance.recognizeOnceAsync(
      (result) => {
        setText(text + " " + result.text);
        setIsRecording(false);
      },
      (error) => {
        console.log(error);
      }
    );
  };





  const handleStopRecording = () => {
    setIsRecording(false);

    if (!recognizer) {
      return;
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSendMessage(text);
    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSendClick = () => {
    setSendClicked(true);
    if (!isRecording && text.trim() !== "") {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <div
      style={{
        padding: "0px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "#262626",
        flexGrow: 1,
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={text}
          type="text"
          placeholder="Enter your message and press ENTER"
          autoFocus
          style={{
            borderColor: "#F64668",
            // color when selected

            // border color when selected
            outlineColor: "#F64668",
          }}
          disabled={isRecording || disabled}
        />
        <button
          id="speak-button"
          type="button"
          style={{
            backgroundColor: "#F64668",
          }}
          onClick={isRecording ? handleStopRecording : handleVoiceRecognition}
        >
          {isRecording ? <StopIcon /> : <KeyboardVoiceIcon />}
        </button>
        <button
          type="button"
          style={{
            backgroundColor: "#F64668",
          }}
          onClick={handleSendClick}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default Input;
