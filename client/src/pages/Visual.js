import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import SummaryContext from '../SummaryContext';
import MessageContext from '../MessageContext';
import MessageContext2 from '../MessageContext2';
import EntityContext from '../EntityContext';
import Input from '../components/Input';

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);
  const [messages2, setMessages2] = useContext(MessageContext2);
  const [entities, setEntities] = useState([]);
  const [entities2, setEntities2] = useState(EntityContext);
  const [comment, setComment] = useState("Tell me about your job");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.183.68.9:5000/summarizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "conversation": [...messages]
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
      const response = await fetch("http://10.183.68.9:5000/visualizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "conversation": [...messages2,
          {
            content: message,
            role: "user",
          }],
          "interview_summary": summary
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
      setEntities2(data.result.entities);
      setComment(data.comment);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };



  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingTop: "50px" }}>
      {comment && (
        <div style={{ backgroundColor: "cornflowerblue", padding: "0px 10px", maxWidth: "300px", margin: "auto", borderRadius: "10px" }}>
          <p style={{ color: "white" }}>{comment}</p>
        </div>
      )}
      {entities && (Object.keys(entities).map((key) => (
        <Entity
          name={key}
          description={entities[key]}
        />
      )))}
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
