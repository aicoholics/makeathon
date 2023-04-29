<<<<<<< HEAD
import Entity from "../components/Entity";
import { useEffect, useState, useContext } from "react";
import MessageContext from "../MessageContext";

import Input from "../components/Input";

const getEntities = async () => {
  const response = await fetch("http://10.183.68.9:5000/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data.entities);
  return data.entities;
};

// create a post request that sends data to here: http://10.183.68.9:5000/ and then awaits a response
// the response should be the data that is sent back from the server

const postEntities = async () => {
  const response = await fetch("http://10.183.68.9:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Chata data
    }),
  });
  const data = await response.json();
  console.log(data.entities);
  return data.entities;
};

const mockData = {
  entities: [{ name: "ENTITY1", description: "DESCRIPTION 1" }],
  relations: [
    { from: "ENTITY1", to: "ENTITY2", description: "RELATION DESCRIPTION 1" },
  ],
};
=======
import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../MessageContext';
import SummaryContext from '../SummaryContext';
import MessageContext2 from '../MessageContext2';
import Input from '../components/Input';
>>>>>>> cac0a127cb428f05030dac58e24fce6988004e87

function Visual() {
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useContext(MessageContext);
<<<<<<< HEAD

  // useEffect(() => {
  //   getEntities().then(data => setEntities(Object.entries(data).map(([name, description]) => ({ name, description }))));
  // }, []);
=======
  const [messages2, setMessages2] = useContext(MessageContext2);
>>>>>>> cac0a127cb428f05030dac58e24fce6988004e87

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

<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (message) => {
    console.log(messages);
    setIsLoading(true);

    // API POST and GET requests

    setIsLoading(false);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {entities.map((entity) => (
        <Entity
          key={entity.name}
          name={entity.name}
          description={entity.description}
=======




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
>>>>>>> cac0a127cb428f05030dac58e24fce6988004e87
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
