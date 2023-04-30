import React from 'react'

function Topbar({ currentStep }) {
  const step1Style = {
    backgroundColor: currentStep >= 1 ? 'green' : 'gray',
    color: '#fff',
    padding: '10px',
    width: '33.33%',
    textAlign: 'center',
    fontWeight: currentStep === 1 ? 'bold' : 'normal'
  }

  const step2Style = {
    backgroundColor: currentStep >= 2 ? 'green' : 'gray',
    color: '#fff',
    padding: '10px',
    width: '33.33%',
    textAlign: 'center',
    fontWeight: currentStep === 2 ? 'bold' : 'normal'
  }

  const step3Style = {
    backgroundColor: currentStep >= 3 ? 'green' : 'gray',
    color: '#fff',
    padding: '10px',
    width: '33.33%',
    textAlign: 'center',
    fontWeight: currentStep === 3 ? 'bold' : 'normal'
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: '2'
    }}>
      <div style={step1Style}>Interview</div>
      <div style={step2Style}>Visualize</div>
      <div style={step3Style}>Suggestor</div>
    </div>
  )
}

export default Topbar
