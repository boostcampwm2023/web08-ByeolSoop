import React from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import diaryAtom from "../atoms/diaryAtom";
import DiaryCreateModal from "../components/DiaryModal/DiaryCreateModal";
import DiaryReadModal from "../components/DiaryModal/DiaryReadModal";
import DiaryListModal from "../components/DiaryModal/DiaryListModal";
import DiaryUpdateModal from "../components/DiaryModal/DiaryUpdateModal";
import DiaryLoadingModal from "../components/DiaryModal/DiaryLoadingModal";
import StarPage from "./StarPage";

function MainPage() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);

  return (
    <>
      <MainPageWrapper
        onClick={(e) => {
          e.preventDefault();
          setDiaryState((prev) => ({ ...prev, isCreate: true, isRead: false }));
        }}
      />
      <StarPage />
      {diaryState.isCreate ? <DiaryCreateModal /> : null}
      {diaryState.isRead ? <DiaryReadModal /> : null}
      {diaryState.isUpdate ? <DiaryUpdateModal /> : null}
      {diaryState.isList ? <DiaryListModal /> : null}
      {diaryState.isLoading ? <DiaryLoadingModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const MainPageWrapper = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default MainPage;
