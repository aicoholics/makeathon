import React, { useState, useEffect } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// .env
import dotenv from "dotenv";
dotenv.config();

const Input = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [sendClicked, setSendClicked] = useState(false);
  const [recognizer, setRecognizer] = useState(null);

  const handleVoiceRecognition = () => {
    setIsRecording(true);

    // Creates an instance of a speech config with specified subscription key and service region.
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.REACT_APP_AZURE_KEY,
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

    // Change the button text to "Stop" while recording
    const speakButton = document.getElementById("speak-button");
    if (speakButton) {
      speakButton.textContent = "Stop";
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);

    if (!recognizer) {
      return;
    }

    recognizer.stopContinuousRecognitionAsync();

    // Reset the button text to "Speak" after recording stops
    const speakButton = document.getElementById("speak-button");
    if (speakButton) {
      speakButton.textContent = "Speak";
    }
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
    <div className="Input">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={text}
          type="text"
          placeholder="Enter your message and press ENTER"
          autoFocus
          disabled={isRecording || disabled}
        />
        <button
          id="speak-button"
          type="button"
          onClick={isRecording ? handleStopRecording : handleVoiceRecognition}
        >
          {isRecording ? "Stop" : "Speak"}
        </button>
        <button type="button" onClick={handleSendClick}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Input;
