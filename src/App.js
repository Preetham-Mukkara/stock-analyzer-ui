import React, { useState, useEffect } from 'react';

function App() {
  const [hello, setHello] = useState('');
  const [message, setMessage] = useState('');
  const [emailData, setEmailData] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create WebSocket connection.
    const newSocket = new WebSocket('ws://localhost:8080/ws');

    // WebSocket event listeners setup
    newSocket.onopen = () => console.log('Connected to WebSocket server');
    newSocket.onmessage = (event) => handleWebSocketMessage(event.data);
    newSocket.onclose = () => console.log('Disconnected from WebSocket server');
    
    // Set the created socket to state
    setSocket(newSocket);

    // Cleanup function - close WebSocket connection on unmount
    return () => newSocket.close();
    
  }, []); // Empty array to only run this effect once after initial render

  function handleWebSocketMessage(data) {
    if (data.startsWith("Email")) {
      setEmailData(data);
    } else {
      setMessage(data);
    }
  }

  function formatMessage(message) {
    // Split the message into lines based on newline characters
    const lines = message.split('\n');
    return (
      <div>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  }

  function sendMessage(command) {
    socket?.send(command);
  };
  
  async function handleHttpRequest(route) {
    try {
      const response = await fetch(`http://localhost:8080/${route}`);
      const text = await response.text();
      setHello(text);      
    } catch(error) {
      console.error("Fetch error:", error);
    }
  }

  function clearData() { 
   setHello('');
   setMessage('');
   setEmailData('')
 }
   
 return (
   <div className="App">
     <h1>Stock Data</h1>
     
     <button onClick={() => sendMessage("show")}>
       Show Me My Stock Data Comparison
     </button>
     <p>{formatMessage(message)}</p>
     
     <button onClick={() => sendMessage("sendEmail")}>
       Send Me An Email With My Stock Data Comparison
     </button>
     <p>{emailData}</p>
     
     <button onClick={() => handleHttpRequest("hello")}>
       Say Hello to me!!
     </button>
     <p>{hello}</p>
     
     <button onClick={clearData}>Clear</button>
   </div>
 );
}

export default App;