import React from 'react'
import { useEffect, useState, useContext } from 'react';
import SummaryContext from '../SummaryContext';
import MessageContext from '../MessageContext';
import MessageContext2 from '../MessageContext2';
import MessageContext3 from '../MessageContext3';
import EntityContext from '../EntityContext';
import Input from '../components/Input';
import Entity from '../components/Entity';

function Suggestor() {

  const [messages3, setMessages3] = useContext(MessageContext3);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log(entities);

    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("http://10.183.68.9:5000/summarizer", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({

    //         // summary
    //         // result entity
    //       }),
    //     });
    //     const data = await response.json();
    //     setSuggestion(data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchData();


  }, []);



  const onSendMessage = async (message) => {
    setIsLoading(true);
    setMessages3([
      ...messages3,
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
          "conversation": [...messages3,
          {
            content: message,
            role: "user",
          }],
          "interview_summary": "summary",
        }),
      });
      const data = await response.json();
      setEntities(data);
      setComment(data.comment);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingTop: "50px" }}>
      {comment && (
        <div style={{ backgroundColor: "cornflowerblue", padding: "0px 10px", maxWidth: "300px", margin: "auto", borderRadius: "10px" }}>
          <p style={{ color: "white" }}>{comment}</p>
        </div>
      )}
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
  )
}

export default Suggestor