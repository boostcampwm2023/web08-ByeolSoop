import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/ModalWrapper";

function DiaryModal() {
  return (
    <ModalWrapper left='67%' width='40vw' height='70vh'>
      <DiaryModalHeader>
        <DiaryModalTitle>새로운 별의 이야기를 적어주세요.</DiaryModalTitle>
        <DiaryModalDate>
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </DiaryModalDate>
      </DiaryModalHeader>
      <DiaryModalInputBox
        fontSize='1.1rem'
        placeholder='제목을 입력해주세요.'
      />
      <DiaryModalContentInputBox placeholder='내용을 입력해주세요.' />
      <DiaryModalInputBox fontSize='1rem' placeholder='태그를 입력해주세요.' />
      <DiaryModalButton>저장하기</DiaryModalButton>
    </ModalWrapper>
  );
}

const DiaryModalHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DiaryModalTitle = styled.h1`
  font-size: 1.5rem;
`;

const DiaryModalDate = styled.div`
  color: rgba(0, 0, 0, 0.55);
`;

const DiaryModalInputBox = styled.input`
  width: 100%;
  height: 3rem;
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;

  font-family: "Pretendard-Medium";
  font-size: ${(props) => props.fontSize}};

  &::placeholder {
    color: #ffffff;
  }
`;

const DiaryModalContentInputBox = styled.textarea`
  width: 100%;
  height: ${(props) => props.height};
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;

  flex-grow: 1;

  font-family: "Pretendard-Medium";
  font-size: 1rem;
  line-height: 1.5rem;

  resize: none;

  word_wrap: break-word;
  word-break: break-all;

  &::placeholder {
    color: #ffffff;
  }
`;

const DiaryModalButton = styled.button`
  width: 100%;
  height: 3.5rem;
  background-color: #3b4874;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 0.2rem;
  color: #ffffff;
  border: none;
  cursor: pointer;
`;

export default DiaryModal;
