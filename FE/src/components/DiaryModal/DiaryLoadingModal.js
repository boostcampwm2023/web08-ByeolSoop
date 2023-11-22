import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import {
  LoadingAnimationWrapper,
  LoadingAnimationIcon,
} from "../../styles/Modal/LoadingAnimation";

function DiaryLoadingModal() {
  return (
    <>
      <DiaryLoadingModalWrapper>
        <LoadingAnimationWrapper>
          <LoadingAnimationIcon />
        </LoadingAnimationWrapper>
        <DiaryLoadingTitle>일기 저장 중</DiaryLoadingTitle>
        <DiaryLoadingContent>
          감정 분석 결과와 함께
          <br />
          보여드릴게요.
        </DiaryLoadingContent>
      </DiaryLoadingModalWrapper>
      <DiaryLoadingModalBackground />
    </>
  );
}

const DiaryLoadingModalWrapper = styled(ModalWrapper)`
  width: 10rem;
  height: 6rem;
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
  line-height: 1.5rem;
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
