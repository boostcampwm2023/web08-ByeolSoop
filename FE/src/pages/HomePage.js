import React from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import headerAtom from "../atoms/headerAtom";
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

const HomepageBackground = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

export default HomePage;
