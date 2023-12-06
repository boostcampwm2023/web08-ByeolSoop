/* eslint-disable no-unused-vars */

import React, { useEffect, useLayoutEffect } from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Route, Routes } from "react-router-dom";
import userAtom from "./atoms/userAtom";
import diaryAtom from "./atoms/diaryAtom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import LoadingPage from "./pages/LoadingPage";
import "./assets/fonts/fonts.css";

const GlobalStyle = createGlobalStyle`
  ${Reset}

  body {
    font-family: "Pretendard-Medium";
	background-color: #000000;
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
  const setDiaryState = useSetRecoilState(diaryAtom);

  useLayoutEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    let nickname = localStorage.getItem("nickname");
    accessToken = accessToken || sessionStorage.getItem("accessToken");
    nickname = nickname || sessionStorage.getItem("nickname");
    if (accessToken) {
      setUserState({ ...userState, isLogin: true, accessToken, nickname });
    }
  }, []);

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event.state) {
        setDiaryState(event.state);
      }
    };
  }, []);

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Routes>
        <Route
          path='/'
          element={userState.isLogin ? <MainPage /> : <HomePage />}
        />
        <Route path='/auth/naver/callback' element={<LoadingPage />} />
      </Routes>
    </div>
  );
}

export default App;
