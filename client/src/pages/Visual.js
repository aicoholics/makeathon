import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../MessageContext';
import SummaryContext from '../SummaryContext';

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

  const [entities, setEntities] = useState([]);

  return (
    <div>
      {entities.map(entity => (
        <Entity key={entity.name} name={entity.name} description={entity.description} />
      ))}
    </div>
  );
}

export default Visual;
