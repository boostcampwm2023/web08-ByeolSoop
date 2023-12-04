import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import {
  LoadingAnimationWrapper,
  LoadingAnimationIcon,
} from "../../styles/Modal/LoadingAnimation";

function DiaryLoadingModal() {
  const setDiaryState = useSetRecoilState(diaryAtom);

  useLayoutEffect(() => {
    setDiaryState((prev) => ({
      ...prev,
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false,
    }));
    setTimeout(() => {
      setDiaryState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }, 1000);
  }, []);

  return (
    <>
      <DiaryLoadingModalWrapper>
        <LoadingAnimationWrapper>
          <LoadingAnimationIcon />
        </LoadingAnimationWrapper>
        <DiaryLoadingTitle>로딩 중입니다.</DiaryLoadingTitle>
        <DiaryLoadingContent>
          당신의 새로운 별자리를
          <br />
          보여드릴게요
        </DiaryLoadingContent>
      </DiaryLoadingModalWrapper>
      <DiaryLoadingModalBackground />
    </>
  );
}

const DiaryLoadingModalWrapper = styled(ModalWrapper)`
  width: 10rem;
  height: 6rem;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2rem 4rem;
  top: 45%;
  left: 50%;
  color: #ffffff;
`;

const DiaryLoadingTitle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
`;

const DiaryLoadingContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  top: 2.5rem;

  font-size: 1rem;
  text-align: center;
  line-height: 1.8rem;
`;

const DiaryLoadingModalBackground = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1003;
`;

export default DiaryLoadingModal;
