import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import ModalTitle from "../../styles/Modal/ModalTitle";
import ModalButton from "../../styles/Modal/ModalButton";
import ModalInputBox from "../../styles/Modal/ModalInputBox";
import ModalBackground from "../ModalBackground/ModalBackground";

function SignUpModalInput({ title, type }) {
  return (
    <SignUpModalInputWrapper>
      <SignUpModalInputTitle>* {title}</SignUpModalInputTitle>
      <ModalInputBox type={type} />
    </SignUpModalInputWrapper>
  );
}

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
          <SignUpModalInput title='이메일' type='email' />
          <SignUpModalInput title='닉네임' type='text' />
          <SignUpModalInput title='비밀번호' type='password' />
          <SignUpModalInput title='비밀번호 확인' type='password' />
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
