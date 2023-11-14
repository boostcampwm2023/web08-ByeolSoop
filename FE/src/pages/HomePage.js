import React from "react";
import styled from "styled-components";
import background from "../assets/background.png";

function HomePage() {
  return (
    <HomePageWrapper>
      <HomeTitle>너의 이야기를 담은 별</HomeTitle>
    </HomePageWrapper>
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
