import './App.css';
import Chat from './pages/Chat';
import Visual from './pages/Visual';
import Topbar from './components/Topbar';
import { useState } from 'react';

function App() {


  const [currentStep, setCurrentStep] = useState(2)

  return (
    <div className="App">
      <Topbar currentStep={currentStep} />
      <Visual />
    </div>
  );
}

export default App;



