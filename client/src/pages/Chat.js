import React, { useState, useContext } from "react";
import Messages from "../components/Messages";
import "../App.css";
import Input from "../components/Input";
import { Button } from "@mui/material";
import MessageContext from "../MessageContext";

function Chat() {

  const [messages, setMessages] = useContext(MessageContext);
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (message) => {
    console.log(messages);
    setIsLoading(true);
    setMessages([
      // spread operator which appends the new message to the end of the array
      ...messages,
      {
        content: message,
        role: "user",
      },
      {
        content: "...",
        role: "assistant",
      },
    ]);

    try {
      const response = await fetch("http://10.183.68.9:5000/interviewer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "conversation": [...messages,
          {
            content: message,
            role: "user",
          }]
        }),

      });
      const data = await response.json();

      console.log(data.content);

      setMessages((messages) => [
        ...messages.slice(0, -1),
        {
          content: data.content,
          role: "assistant",
        },
      ]);


    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="Chat">
      <Messages messages={messages} currentMember="user" />

      <Input onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Chat;