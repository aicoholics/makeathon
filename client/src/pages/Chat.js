import React, { useState, useContext, useRef, useEffect } from "react";
import Messages from "../components/Messages";
import "../App.css";
import Input from "../components/Input";
import { Button } from "@mui/material";
import MessageContext from "../MessageContext";
import { apiUrl } from '../config.js';

function Chat() {

  const [messages, setMessages] = useContext(MessageContext);
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const onSendMessage = async (message) => {
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
      const response = await fetch(apiUrl + "interviewer", {
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
      // console.log(data);
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

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="Chat">
      <div>
        <Messages messages={messages} currentMember="user" />
        <div ref={bottomRef}></div>
      </div>
      <div style={{ paddingBottom: "100px" }}></div>
      <Input onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Chat;