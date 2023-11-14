import React from "react";
import styled from "styled-components";
import ModalBackground from "../ModalBackground.js/ModalBackground";

function SignUpModal() {
  return (
    <>
      <ModalBackground />
      <SignUpModalWrapper>
        <SignUpModalTitleWrapper>
          <SignUpModalTitle>회원가입</SignUpModalTitle>
          <SignUpModalSubtitle>
            회원이 되어 당신의 이야기를 펼쳐보세요!
          </SignUpModalSubtitle>
        </SignUpModalTitleWrapper>
        <SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 이메일</SignUpModalInputTitle>
            <SignUpModalInputBox type='email' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 닉네임</SignUpModalInputTitle>
            <SignUpModalInputBox type='text' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 비밀번호</SignUpModalInputTitle>
            <SignUpModalInputBox type='password' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 비밀번호 확인</SignUpModalInputTitle>
            <SignUpModalInputBox type='password' />
          </SignUpModalInputWrapper>
        </SignUpModalInputWrapper>
        <SignUpModalButtonWrapper>
          <SignUpModalButton>가입하기</SignUpModalButton>
        </SignUpModalButtonWrapper>
      </SignUpModalWrapper>
    </>
  );
}

const SignUpModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1001;
  width: 25rem;
  height: 40rem;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  transform: translate(-50%, -50%);
  border-radius: 1rem;
  padding: 4rem;
  color: #ffffff;
`;

const SignUpModalTitleWrapper = styled.div``;

const SignUpModalTitle = styled.div`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const SignUpModalSubtitle = styled.div`
  font-size: 1rem;
`;

const SignUpModalInputWrapper = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const SignUpModalInputTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const SignUpModalInputBox = styled.input`
  width: 100%;
  height: 3rem;
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 0 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;
`;

const SignUpModalButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SignUpModalButton = styled.button`
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

export default SignUpModal;
