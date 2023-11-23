import React, { useLayoutEffect } from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { useRecoilState } from "recoil";
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

  * {

    &::-webkit-scrollbar {
      width: 0.5rem;
      height: 0.5rem;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff;
      border-radius: 1rem;
    }
  }
`;

function App() {
  const [userState, setUserState] = useRecoilState(userAtom);

  useLayoutEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setUserState({ ...userState, isLogin: true, accessToken });
    }
  }, []);

  return (
    <div className='App'>
      <GlobalStyle />
      <Header />
      {userState.isLogin ? <MainPage /> : <HomePage />}
    </div>
  );
}

export default App;
