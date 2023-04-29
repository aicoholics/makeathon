import React, { useState } from "react";

const Input = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    onSendMessage(text);
    setText("");
  };

  const handleChange = (e) => {
    setText(e.target.value);
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
          disabled={disabled}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Input;
