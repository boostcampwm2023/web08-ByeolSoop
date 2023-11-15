import React from "react";
import styled from "styled-components";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import ModalTitle from "../../styles/Modal/ModalTitle";
import ModalButton from "../../styles/Modal/ModalButton";
import ModalInputBox from "../../styles/Modal/ModalInputBox";
import ModalBackground from "../ModalBackground/ModalBackground";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";

function LoginModal() {
  return (
    <>
      <ModalWrapper left='50%' width='25rem' height='40rem'>
        <ModalTitle>로그인</ModalTitle>
        <InputBar>
          <ModalInputBox type='email' placeholder='아이디를 입력하세요' />
          <ModalInputBox type='password' placeholder='비밀번호를 입력하세요' />
          <CheckBar>
            <input type='checkbox' />
            <div>로그인 유지</div>
          </CheckBar>
        </InputBar>
        <ModalButton>로그인</ModalButton>
        <HelpBar>
          <div>회원가입</div>
          <HelpBarBorder />
          <div>아이디/비밀번호 찾기</div>
        </HelpBar>
        <EasyLoginBar>
          <EasyLoginBarTitle>
            <EasyLoginBarBorder />
            <div>간편 로그인</div>
            <EasyLoginBarBorder />
          </EasyLoginBarTitle>
          <ModalButton bg='#03c75a' fontSize='1rem'>
            <CorpLogo src={naver} alt='naver' />
            네이버 로그인
          </ModalButton>
          <ModalButton bg='#fee500' color='#3c1e1e' fontSize='1rem'>
            <CorpLogo src={kakao} alt='kakao' />
            카카오 로그인
          </ModalButton>
        </EasyLoginBar>
      </ModalWrapper>
      <ModalBackground />
    </>
  );
}

const InputBar = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
`;

const CheckBar = styled.div`
  width: 100%;
  margin-top: 0.5rem;

  display: flex;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;

  font-size: 1rem;
  color: #ffffff;
`;

const HelpBar = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  font-size: 1rem;
  color: #ffffff;
`;

const HelpBarBorder = styled.div`
  width: 1.2px;
  height: 1rem;
  background-color: #ffffff;
`;

const EasyLoginBar = styled.div`
  width: 100%;
  margin-top: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  font-size: 1rem;
  color: #ffffff;
`;

const EasyLoginBarTitle = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const EasyLoginBarBorder = styled.div`
  width: 9rem;
  height: 1px;
  background-color: #ffffff;
`;

const CorpLogo = styled.img`
  width: 1rem;
  height: 1rem;
`;

export default LoginModal;
