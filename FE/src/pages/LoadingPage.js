import React, { useEffect } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import homeBackground from "../assets/homeBackground.png";

function LoadingPage() {
  const data = window.location.pathname + window.location.search;

  const { mutate: login } = useMutation(() => {
    fetch(`http://223.130.129.145:3005${data}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/";
      });
  });

  useEffect(() => {
    login();
  }, []);

  return <LoadingPageWrapper />;
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
