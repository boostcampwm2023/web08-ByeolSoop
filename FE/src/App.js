import React from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { RecoilRoot } from "recoil";
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
    <RecoilRoot>
      <GlobalStyle />
      <Header />
      <HomePage />
    </RecoilRoot>
  );
}

export default App;
