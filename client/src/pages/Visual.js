import Entity from "../components/Entity";
import { useEffect, useState, useContext } from "react";
import SummaryContext from "../SummaryContext";
import MessageContext from "../MessageContext";
import MessageContext2 from "../MessageContext2";
import EntityContext from "../EntityContext";
import Input from "../components/Input";
import { apiUrl } from "../config.js";

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);
  const [messages2, setMessages2] = useContext(MessageContext2);
  const [entities, setEntities] = useContext(EntityContext);

  const [comment, setComment] = useState(
    "Hey, I'm your visual AI assistant, please explain me more about your workflow"
  );
  const [showComment, setShowComment] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        setShowComment(false);
      }, 5000); // hide the comment after 5 seconds
      try {
        const response = await fetch(apiUrl + "summarizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation: [...messages],
          }),
        });
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const onSendMessage = async (message) => {
    setIsLoading(true);
    setMessages2([
      ...messages2,
      {
        content: message,
        role: "user",
      },
    ]);
    try {
      const response = await fetch(apiUrl + "visualizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: [
            ...messages2,
            {
              content: message,
              role: "user",
            },
          ],
          interview_summary: summary,
        }),
      });
      const data = await response.json();
      setMessages2((messages2) => [
        ...messages2,
        {
          content: JSON.stringify(data.result),
          role: "assistant",
        },
      ]);
      setEntities(data.result.entities);
      setComment(data.comment);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", paddingTop: "50px" }}
    >
      {showComment && comment && (
        <div
          style={{
            backgroundColor: "#483d8b",
            padding: "0px 10px",
            maxWidth: "300px",
            margin: "auto",
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            width: "50%",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "0.5",
            borderRadius: "10px",
          }}
        >
          <p style={{ color: "white" }}>{comment}</p>
        </div>
      )}
      <div>
        {Object.keys(entities).map((key) => (
          <Entity name={key} description={entities[key]} makeComplex={true} />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          width: 1000,
          paddingBottom: 40,
        }}
      >
        <Input onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default Visual;
