import "./App.css";
import Chat from "./pages/Chat";
import Visual from "./pages/Visual";
import Suggestor from "./pages/Suggestor";
import Topbar from "./components/Topbar";
import { useState } from "react";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MessageContext from "./MessageContext";
import MessageContext2 from "./MessageContext2";
import MessageContext3 from "./MessageContext3";
import SummaryContext from "./SummaryContext";
import EntityContext from "./EntityContext";
import { blue, grey, orange } from "@mui/material/colors";

function App() {
  const [messages, setMessages] = useState([
    {
      content:
        "Hello, I am your AI consultant. Please tell me about your job/company/industry!",
      role: "assistant",
    },
  ]);
  const [messages2, setMessages2] = useState([]);
  const [message3, setMessage3] = useState([]);
  const [summary, setSummary] = useState("");
  const [entities, setEntities] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <EntityContext.Provider value={[entities, setEntities]}>
      <MessageContext3.Provider value={[message3, setMessage3]}>
        <MessageContext2.Provider value={[messages2, setMessages2]}>
          <MessageContext.Provider value={[messages, setMessages]}>
            <SummaryContext.Provider value={[summary, setSummary]}>
              <div className="App">
                <Topbar currentStep={currentStep} />
                {currentStep === 1 && <Chat />}
                {currentStep === 2 && <Visual />}
                {currentStep === 3 && <Suggestor />}
                {currentStep < 4 && (
                  <div>
                    <Button
                      sx={{
                        position: "fixed",
                        bottom: 0,
                        right: 0,
                        marginRight: "20px",
                        marginBottom: "35px",
                        backgroundColor: "#483d8b",
                      }}
                      variant="contained"
                      component="label"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next <ArrowForwardIcon />
                    </Button>
                    <Button
                      sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        marginLeft: "20px",
                        marginBottom: "35px",
                        backgroundColor: "#333333",
                      }}
                      variant="contained"
                      component="label"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ArrowBackIcon /> Back
                    </Button>
                  </div>
                )}
              </div>
            </SummaryContext.Provider>
          </MessageContext.Provider>
        </MessageContext2.Provider>
      </MessageContext3.Provider>
    </EntityContext.Provider>
  );
}

export default App;
