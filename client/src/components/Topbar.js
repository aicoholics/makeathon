import React from "react";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";

function Topbar({ currentStep }) {
  const step1Style = {
    backgroundColor: currentStep >= 1 ? "#41436A" : "gray",
    color: "#fff",
    padding: "10px",
    width: "33.33%",
    textAlign: "center",
    fontWeight: currentStep === 1 ? "800" : "normal",
  };

  const step2Style = {
    backgroundColor: currentStep >= 2 ? "#41436A" : "gray",
    color: "#fff",
    padding: "10px",
    width: "33.33%",
    textAlign: "center",
    fontWeight: currentStep === 2 ? "800" : "normal",
  };

  const step3Style = {
    backgroundColor: currentStep >= 3 ? "#41436A" : "gray",
    color: "#fff",
    padding: "10px",
    width: "33.33%",
    textAlign: "center",
    fontWeight: currentStep === 3 ? "800" : "normal",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: "2",
      }}
    >
      <div style={step1Style}>Interview</div>
      <div style={step2Style}>Analysis</div>
      <div style={step3Style}>Use Case</div>
    </div>
  );
}

export default Topbar;
