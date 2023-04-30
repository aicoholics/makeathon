import React from "react";

const toName = { assistant: "AI Consultant", user: "Me" };
const toColor = { assistant: "blue", user: "#F64668" };

const Messages = ({ messages, currentMember }) => {
  const renderMessage = (message, index, currentMember) => {
    const { role, content } = message;
    const backgroundColor = role === "assistant" ? "blue" : "#F64668";
    const style = { backgroundColor };

    const messageFromMe = role === currentMember;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    return (
      <li key={index} className={className}>
        {/* <span style={{ backgroundColor: toColor[role] }} /> */}

        <div className="Message-content">
          <div className="username">{toName[role]}</div>
          <div className="text">{content}</div>
        </div>
      </li>
    );
  };

  return (
    <ul className="Messages-list">
      {messages.map((message, index) =>
        renderMessage(message, index, currentMember)
      )}
    </ul>
  );
};

export default Messages;
