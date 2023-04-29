import React, { useState } from "react";
import Messages from "../components/Messages";
import "../App.css";
import Input from "../components/Input";

function Chat() {
  // definition of member
  const [member] = useState({
    username: "User",
    color: "blue",
  });

  const [messages, setMessages] = useState([
    {
      text: "Hello I am your new AI consultant. Tell me more about your job.",
      member: {
        username: "AI Consultant",
        color: "blue",
      },
    },
  ]);

  console.log(messages);

  const onSendMessage = (message) => {
    setMessages([
      // spread operator which appends the new message to the end of the array
      ...messages,
      {
        text: message,
        member,
      },
      {
        text: "Tell me more about your job.",
        member: {
          color: "blue",
          username: "AI Consultant",
        },
      },
    ]);
  };

  return (
    <div className="Chat">
      <Messages messages={messages} currentMember={member} />
      <Input onSendMessage={onSendMessage} />
    </div>
  );
}

export default Chat;
