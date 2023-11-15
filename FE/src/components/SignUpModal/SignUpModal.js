import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/ModalWrapper";
import ModalTitle from "../../styles/ModalTitle";
import ModalButton from "../../styles/ModalButton";
import ModalInputBox from "../../styles/ModalInputBox";
import ModalBackground from "../ModalBackground/ModalBackground";

function SignUpModal() {
  return (
    <>
      <ModalBackground />
      <ModalWrapper left='50%' width='25rem' height='40rem'>
        <SignUpModalTitleWrapper>
          <ModalTitle>회원가입</ModalTitle>
          <SignUpModalSubtitle>
            회원이 되어 당신의 이야기를 펼쳐보세요!
          </SignUpModalSubtitle>
        </SignUpModalTitleWrapper>
        <SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 이메일</SignUpModalInputTitle>
            <ModalInputBox type='email' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 닉네임</SignUpModalInputTitle>
            <ModalInputBox type='text' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 비밀번호</SignUpModalInputTitle>
            <ModalInputBox type='password' />
          </SignUpModalInputWrapper>
          <SignUpModalInputWrapper>
            <SignUpModalInputTitle>* 비밀번호 확인</SignUpModalInputTitle>
            <ModalInputBox type='password' />
          </SignUpModalInputWrapper>
        </SignUpModalInputWrapper>
        <ModalButton>가입하기</ModalButton>
      </ModalWrapper>
    </>
  );
}

const SignUpModalTitleWrapper = styled.div``;

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

export default SignUpModal;
