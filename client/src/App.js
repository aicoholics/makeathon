import "./App.css";
import Chat from "./pages/Chat";
import Visual from "./pages/Visual";
import Topbar from "./components/Topbar";
import { useState } from "react";
import { Button } from "@mui/material";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="App">
      <Topbar currentStep={currentStep} />
      {currentStep === 1 && <Chat />}
      {currentStep === 2 && <Visual />}
      {currentStep < 3 && (
        <div>

          <Button
            sx={{ position: "absolute", bottom: 0, right: 0 }}
            variant="contained"
            component="label"
            onClick={handleNext}
          >
            Next
          </Button>
          <Button
            sx={{ position: "absolute", bottom: 0, left: 0 }}
            variant="contained"
            component="label"
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
