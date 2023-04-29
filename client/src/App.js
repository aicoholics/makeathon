import "./App.css";
import Chat from "./pages/Chat";
import Visual from "./pages/Visual";
import Topbar from "./components/Topbar";
import { useState } from "react";
import { Button } from "@mui/material";
import MessageContext from "./MessageContext";
import SummaryContext from "./SummaryContext";

function App() {
  const [messages, setMessages] = useState([
    {
      content: "Hello I am your new AI consultant. Tell me more about your job.",
      role: "assistant",
    },
  ]);
  const [summary, setSummary] = useState("");
  const [currentStep, setCurrentStep] = useState(1);


  return (
    <MessageContext.Provider value={[messages, setMessages]}>
      <SummaryContext.Provider value={[summary, setSummary]}>
        <div className="App">
          <Topbar currentStep={currentStep} />
          {currentStep === 1 && <Chat />}
          {currentStep === 2 && <Visual />}
          {currentStep < 4 && (
            <div>

              <Button
                sx={{ position: "absolute", bottom: 0, right: 0 }}
                variant="contained"
                component="label"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Button>
              <Button
                sx={{ position: "absolute", bottom: 0, left: 0 }}
                variant="contained"
                component="label"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </SummaryContext.Provider>
    </MessageContext.Provider>
  );
}

export default App;
