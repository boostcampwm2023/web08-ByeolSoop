import React from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import MainPage from "./pages/MainPage";
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
      <MainPage />
    </div>
  );
}

export default App;
