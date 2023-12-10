import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import headerAtom from "../atoms/headerAtom";
// import homeBackground from "../assets/homeBackground.png";
import LoginModal from "../components/LoginModal/LoginModal";
import SignUpModal from "../components/SignUpModal/SignUpModal";

function HomePage() {
  const headerState = useRecoilValue(headerAtom);

  return (
    <>
      <HomepageBackground autoPlay loop muted>
        <source src='/homepage.mp4' type='video/mp4' />
      </HomepageBackground>

      {headerState.isLogin ? <LoginModal /> : null}
      {headerState.isSignUp ? <SignUpModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
// const HomePageWrapper = styled.div`
//   height: 100vh;
//   background-image: url(${homeBackground});
//   background-repeat: no-repeat;
//   background-position: center;
//   background-size: cover;

//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

const HomepageBackground = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

export default HomePage;
