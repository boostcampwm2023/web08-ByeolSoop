import React, { useEffect } from "react";
import styled from "styled-components";
import ModalWrapper from "../styles/Modal/ModalWrapper";
import ModalBackground from "../components/ModalBackground/ModalBackground";

function RedirectToHomepage() {
  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("nickname");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  return (
    <>
      <RedirectToHomepageWrapper>
        <RedirectToHomepageTitle>
          로그인이 만료되었습니다.
        </RedirectToHomepageTitle>
        <RedirectToHomepageContent>
          3초 후 메인 페이지로 이동합니다.
        </RedirectToHomepageContent>
      </RedirectToHomepageWrapper>
      <ModalBackground $zindex={1005} />
    </>
  );
}

const RedirectToHomepageWrapper = styled(ModalWrapper)`
  width: 20rem;
  height: 10rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2rem 4rem;
  top: 45%;
  left: 50%;
  color: #ffffff;
  z-index: 1006;
`;

const RedirectToHomepageTitle = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RedirectToHomepageContent = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  top: 2.5rem;
  text-align: center;
  line-height: 1.8rem;
`;

export default RedirectToHomepage;
