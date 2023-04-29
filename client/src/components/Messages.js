import React from "react";

const Messages = ({ messages, currentMember }) => {
  const renderMessage = (message, index, currentMember) => {
    const { member, text } = message;
    const messageFromMe = member.username === currentMember.username;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    return (
      <li key={index} className={className}>
        <span className="avatar" style={{ backgroundColor: member.color }} />
        <div className="Message-content">
          <div className="username">{member.username}</div>
          <div className="text">{text}</div>
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
