import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import diaryAtom from "../atoms/diaryAtom";
import DiaryCreateModal from "../components/DiaryModal/DiaryCreateModal";
import DiaryReadModal from "../components/DiaryModal/DiaryReadModal";
import background from "../assets/background.png";

function MainPage() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);

  return (
    <>
      <MainPageWrapper
        onClick={(e) => {
          e.preventDefault();
          setDiaryState({
            isCreate: false,
            isRead: !diaryState.isRead,
          });
        }}
      >
        <MainTitle>대충 메인 페이지</MainTitle>
      </MainPageWrapper>
      {diaryState.isCreate ? <DiaryCreateModal /> : null}
      {diaryState.isRead ? <DiaryReadModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const MainPageWrapper = styled.div`
  height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainTitle = styled.h1`
  position: relative;
  top: -4rem;

  font-size: 3rem;
  color: #ffffff;
`;

export default MainPage;
