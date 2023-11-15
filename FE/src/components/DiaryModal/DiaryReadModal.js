import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/ModalWrapper";

function DiaryReadModal() {
  return (
    <ModalWrapper left='67%' width='40vw' height='70vh' opacity='0.3'>
      <DiaryModalHeader>
        <DiaryModalTitle>아주 멋진 나!</DiaryModalTitle>
        <DiaryDeleteButton>삭제</DiaryDeleteButton>
      </DiaryModalHeader>
      <DiaryModalContent>
        오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을
        만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는
        모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은
        멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다!
        오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을
        만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는
        모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은
        멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다!
        오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을
        만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는
        모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은
        멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다!
        오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을
        만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는
        모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은
        멋있는 모달을 만들었다. 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은
        멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다!
        오늘은 멋있는 모달을 만들었다. 오늘은 멋있는 모달을 만들었다. 멋있다!
        오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 오늘은 멋있는 모달을 만들었다.
        멋있다! 오늘은 멋있는 모달을 만들었다. 멋있다! 오늘은 멋있는 모달을
        만들었다. 멋있다! 오늘은 멋있는 모달을 만들었다.
      </DiaryModalContent>
      <DiaryModalTagBar>
        <DiaryModalTagName>태그</DiaryModalTagName>
        <DiaryModalTagList>
          <DiaryModalTag>멋있다!</DiaryModalTag>
          <DiaryModalTag>맛있다!</DiaryModalTag>
        </DiaryModalTagList>
      </DiaryModalTagBar>
      <div>감정 분석 결과</div>
    </ModalWrapper>
  );
}

// ToDo: 통합 필요
const DiaryModalHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DiaryModalTitle = styled.div`
  flex-grow: 1;
  font-size: 1.2rem;
`;

const DiaryDeleteButton = styled.button`
  width: 3rem;
  height: 1rem;
  border: hidden;
  background: none;

  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;

  cursor: pointer;
`;

const DiaryModalContent = styled.div`
  width: 100%;
  height: 50%;
  line-height: 1.5rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DiaryModalTagName = styled.div`
  width: 3rem;
  font-size: 1rem;
`;

const DiaryModalTagBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const DiaryModalTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 2rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 0.5rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;
`;

const DiaryModalTagList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default DiaryReadModal;
