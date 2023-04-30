import React from 'react'
import { useEffect, useState, useContext, useRef } from 'react';
import SummaryContext from '../SummaryContext';
import MessageContext from '../MessageContext';
import MessageContext2 from '../MessageContext2';
import MessageContext3 from '../MessageContext3';
import EntityContext from '../EntityContext';
import Input from '../components/Input';
import Entity from '../components/Entity';
import { apiUrl } from '../config.js';

function Suggestor() {

  const [messages3, setMessages3] = useContext(MessageContext3);
  const [entities, setEntities] = useContext(EntityContext);
  const [summary, setSummary] = useContext(SummaryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [comment, setComment] = useState("");

  const [current_approach, setCurrentApproach] = useState("");
  const [expected_value, setExpectedValue] = useState("");
  const [problem, setProblem] = useState("");
  const [required_resources, setRequiredResources] = useState("");
  const [risks, setRisks] = useState("");
  const [solution, setSolution] = useState("");

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {

    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "suggester", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "interview_summary": summary,
            "structure": entities,
            "conversation": []
          }),
        });
        const data = await response.json();
        console.log(data.result);
        setComment(data.comment);
        setSuggestion(data);
        setCurrentApproach(data.result.current_approach);
        setExpectedValue(data.result.expected_value);
        setProblem(data.result.problem);
        setRequiredResources(data.result.required_resources);
        setRisks(data.result.risks);
        setSolution(data.result.solution);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    hasMounted.current = true;
  }
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
      const response = await fetch(apiUrl + "suggester", {
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
          "interview_summary": summary,
          "structure": entities,
        }),
      });
      const data = await response.json();
      console.log(data.result);
      setComment(data.comment);
      setSuggestion(data);
      setCurrentApproach(data.result.current_approach);
      setExpectedValue(data.result.expected_value);
      setProblem(data.result.problem);
      setRequiredResources(data.result.required_resources);
      setRisks(data.result.risks);
      setSolution(data.result.solution);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingTop: "50px" }}>
      <div>
        {comment && (
          <div style={{ backgroundColor: "cornflowerblue", padding: "0px 10px", maxWidth: "300px", margin: "auto", borderRadius: "10px" }}>
            <p style={{ color: "white" }}>{comment}</p>
          </div>
        )}
      </div>


      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center" }}>
        <div className='one' style={{ flexBasis: '30%', marginBottom: '20px', position: "fixed", left: "10px", width: "28%" }}>
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',
            height: "32vh",
            width: "100%"
          }}>
            <h3>Current Approach</h3>
            <hr />
            <p>{current_approach}</p>
          </div>

          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',
            height: "200px",
            marginTop: "20px",
            height: "32vh",
            width: "100%"
          }}>
            <h3>Problem</h3>
            <hr />
            <p>{problem}</p>
          </div>
        </div>

        <div className='two' style={{ flexBasis: '30%', marginBottom: '20px' }}>
          {Object.keys(entities).map((key) => (
            <Entity
              key={key}
              name={key}
              description={entities[key]}
            />
          ))}
        </div>


        <div className='three' style={{ flexBasis: '30%', marginBottom: '20px', position: "fixed", right: "50px", width: "28%"}}>
          <div style={{
            backgroundColor: '#483d8b',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',

            width: "100%"
          }}>
            <h3>Solution</h3>
            <hr />
            <details open={true}>
            <summary>Details</summary>
            <p>{solution}</p>
          </details>
          </div>
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',

            marginTop: "20px",
            width: "100%"
          }}>
            <h3>Expected Value</h3>
            <hr />
            <details open='false'>
            <summary>Details</summary>
            <p>{expected_value}</p>
          </details>
          </div>
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',
            marginTop: "20px",
            width: "100%"
          }}>
            <h3>Risks</h3>
            <hr />
            <details open='false'>
            <summary>Details</summary>
            <p>{risks}</p>
          </details>
          </div>
          <div style={{
            backgroundColor: '#333',
            borderRadius: '10px',
            padding: '5px 20px',
            color: '#fff',
            marginTop: "20px",
            width: "100%"
          }}>
            <h3>Required Resources</h3>
            <hr />
            <details open='false'>
            <summary>Details</summary>
            <p>{required_resources}</p>
          </details>
          </div>

        </div>

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
  )
}

export default Suggestor