import Entity from '../components/Entity';
import { useEffect, useState, useContext, useRef } from 'react';
import SummaryContext from '../SummaryContext';
import MessageContext from '../MessageContext';
import MessageContext2 from '../MessageContext2';
import EntityContext from '../EntityContext';
import Input from '../components/Input';
import { apiUrl } from '../config.js';

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);
  const [messages2, setMessages2] = useContext(MessageContext2);
  const [entities, setEntities] = useContext(EntityContext);

  const [comment, setComment] = useState(
    "Please explain the structure of your work/company/industry in detail."
  );
  const [showComment, setShowComment] = useState(true);

  const hasMounted = useRef(false);

useEffect(() => {
  if (!hasMounted.current) {
    const fetchData = async () => {
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
        console.log('summary:' + data);
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    hasMounted.current = true;
  }
}, [messages]);

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
            borderRadius: "10px",
          }}
        >
          <p>{comment}</p>
        </div>
      )}


      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {Object.keys(entities).map((key) => (
          <Entity name={key} description={entities[key]} makeComplex={true} />
        ))}
      </div>

      {isLoading ? <div className="spinner"
        style={{
          margin: "auto",
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "0.5",
        }}
      ></div> : null}

      <div style={{ paddingBottom: "100px" }}></div>
      <Input onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
}

export default Visual;
