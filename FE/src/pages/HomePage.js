import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import headerAtom from "../atoms/headerAtom";

import background from "../assets/background.png";
import LoginModal from "../components/LoginModal/LoginModal";
import SignUpModal from "../components/SignUpModal/SignUpModal";

function HomePage() {
  const headerState = useRecoilValue(headerAtom);

  return (
    <>
      <HomePageWrapper>
        <HomeTitle>너의 이야기를 담은 별</HomeTitle>
      </HomePageWrapper>

      {headerState.isLogin ? <LoginModal /> : null}
      {headerState.isSignUp ? <SignUpModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const HomePageWrapper = styled.div`
  height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const HomeTitle = styled.h1`
  position: relative;
  top: -4rem;

  font-size: 3rem;
  color: #ffffff;
`;

export default HomePage;
