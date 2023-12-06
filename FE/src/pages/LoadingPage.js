import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import headerAtom from "../atoms/headerAtom";
import LoginModal from "../components/LoginModal/LoginModal";
import SignUpModal from "../components/SignUpModal/SignUpModal";
import homeBackground from "../assets/homeBackground.png";

function LoadingPage() {
  const [headerState, setHeaderState] = useRecoilState(headerAtom);

  const { mutate: login } = useMutation(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${
        window.location.pathname + window.location.search
      }`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          sessionStorage.setItem("accessToken", data.accessToken);
          sessionStorage.setItem("nickname", data.nickname);
        }
        window.location.href = "/";
      });
  });

  useEffect(() => {
    if (window.location.search.includes("code=")) {
      login();
    } else {
      setHeaderState((prev) => ({
        ...prev,
        isLogin: true,
      }));
    }
  }, []);

  return (
    <>
      <LoadingPageWrapper />
      {headerState.isLogin ? <LoginModal /> : null}
      {headerState.isSignUp ? <SignUpModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const LoadingPageWrapper = styled.div`
  height: 100vh;
  background-image: url(${homeBackground});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LoadingPage;
