import React from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import "./assets/fonts/fonts.css";

const GlobalStyle = createGlobalStyle`
  ${Reset}
  body {
    font-family: "Pretendard-Medium";
  }
`;

function App() {
  return (
    <div className='App'>
      <GlobalStyle />
      <Header />
      <HomePage />
    </div>
  );
}

export default App;
