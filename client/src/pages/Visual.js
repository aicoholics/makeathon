import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../MessageContext';
import SummaryContext from '../SummaryContext';
import MessageContext2 from '../MessageContext2';
import Input from '../components/Input';

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);
  const [messages2, setMessages2] = useContext(MessageContext2);

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
          content: JSON.stringify(data),
          role: "assistant",
        },
      ]);
      setEntities(data.entities);
      console.log(data.entities);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const [entities, setEntities] = useState([]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {Object.keys(entities).map((key) => (
        <Entity
          name={key}
          description={entities[key]}
        />
      ))}
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
