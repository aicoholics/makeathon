import React, { useState } from "react";
import Messages from "../components/Messages";
import "../App.css";
import Input from "../components/Input";

function Chat() {

  const [user] = useState({
    username: "User",
    color: "blue",
  });
  const [assistant] = useState({
    username: "AI Consultant",
    color: "blue",
  });


  const [messages, setMessages] = useState([
    {
      text: "Hello I am your new AI consultant. Tell me more about your job.",
      member: assistant,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (message) => {
    setIsLoading(true);
    setMessages([
      // spread operator which appends the new message to the end of the array
      ...messages,
      {
        text: message,
        member: user,
      },
      {
        text: "...",
        member: assistant,
      },
    ]);

    try {
      const response = await fetch("http://10.183.68.9:5000/interviewer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "conversation": messages }),
      });
      const data = await response.json();

      console.log(data.content);

      setMessages((messages) => [
        ...messages.slice(0, -1),
        {
          text: data.content,
          member: assistant,
        },
      ]);

    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="Chat">
      <Messages messages={messages} currentMember={user} />
      <Input onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Chat;