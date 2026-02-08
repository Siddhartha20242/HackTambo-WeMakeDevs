/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ReactDOM from "react-dom";
import GroqSuggestions from "./GroqSuggestions";

// 🔥 Expose globally on window
(window as unknown).React = React;
(window as any).ReactDOM = ReactDOM;
(window as any).GroqSuggestions = GroqSuggestions;

// Optional: render locally for testing
// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <GroqSuggestions />,
  document.getElementById("root")
);
