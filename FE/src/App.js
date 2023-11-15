import React from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import "./assets/fonts/fonts.css";

const GlobalStyle = createGlobalStyle`
  ${Reset}
  body {
    font-family: "Pretendard-Medium";
  }
`;

function App() {
  const userState = useRecoilValue(userAtom);

  return (
    <div className='App'>
      <GlobalStyle />
      <Header />
      {userState.isLogin ? <MainPage /> : <HomePage />}
    </div>
  );
}

export default App;
