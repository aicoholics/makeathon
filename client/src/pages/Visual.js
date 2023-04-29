import Entity from '../components/Entity';
import { useEffect, useState, useContext } from 'react';
import MessageContext from '../MessageContext';

const getEntities = async () => {
  const response = await fetch('http://10.183.68.9:5000/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  console.log(data.entities)
  return data.entities
}

// create a post request that sends data to here: http://10.183.68.9:5000/ and then awaits a response
// the response should be the data that is sent back from the server

const postEntities = async () => {
  const response = await fetch('http://10.183.68.9:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Chata data
    })
  })
  const data = await response.json()
  console.log(data.entities)
  return data.entities
}




const mockData = {
  "entities": [
    { "name": "ENTITY1", "description": "DESCRIPTION 1" },
  ],
  "relations": [
    { "from": "ENTITY1", "to": "ENTITY2", "description": "RELATION DESCRIPTION 1" },
  ]
}


function Visual() {
  const [entities, setEntities] = useState([]);
  const [messages, setMessages] = useContext(MessageContext);

  // useEffect(() => {
  //   getEntities().then(data => setEntities(Object.entries(data).map(([name, description]) => ({ name, description }))));
  // }, []);


  useEffect(() => {
    setEntities(mockData.entities);
  }, []);

  return (
    <div >
      {entities.map(entity => (
        <Entity key={entity.name} name={entity.name} description={entity.description} />
      ))}
    </div>
  );
}

export default Visual;
