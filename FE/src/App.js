/* eslint-disable no-unused-vars */

import React, { useEffect, useLayoutEffect } from "react";
import Reset from "styled-reset";
import { createGlobalStyle } from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Route, Routes } from "react-router-dom";
import userAtom from "./atoms/userAtom";
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
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);

      const accessToken = params.get("access-token");
      const nickname = params.get("nickname");

      if (accessToken && nickname) {
        setUserState({ ...userState, isLogin: true, accessToken, nickname });
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("nickname", nickname);
        window.history.replaceState({}, "", "/");
      }
    }
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
        <Route path='/auth/kakao/callback' element={<LoadingPage />} />
      </Routes>
    </div>
  );
}

export default App;
