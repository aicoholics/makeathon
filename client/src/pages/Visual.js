import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../MessageContext';
import SummaryContext from '../SummaryContext';
import Input from '../components/Input';

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [messages, setMessages] = useContext(MessageContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        console.log(data);
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    setIsLoading(false);

    fetchData();
  }, []);

  const onSendMessage = async (message) => {
    setIsLoading(true);
    setMessages([
      // spread operator which appends the new message to the end of the array

    ]);
  }


  const [entities, setEntities] = useState([]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {entities.map((entity) => (
        <Entity
          key={entity.name}
          name={entity.name}
          description={entity.description}
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
