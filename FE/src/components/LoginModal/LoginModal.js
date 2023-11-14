import React from "react";
import styled from "styled-components";
import ModalBackground from "../ModalBackground.js/ModalBackground";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";

function LoginModal() {
  return (
    <>
      <LoginModalWrapper>
        <ModalTitle>로그인</ModalTitle>
        <InputBar>
          <UserInput type='email' placeholder='아이디를 입력하세요' />
          <UserInput type='password' placeholder='비밀번호를 입력하세요' />
        </InputBar>
        <CheckBar>
          <input type='checkbox' />
          <div>로그인 유지</div>
        </CheckBar>
        <Button bg='#3b4874' color='#ffffff' fontSize='1.25rem'>
          로그인
        </Button>
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
          <Button bg='#03c75a' color='#ffffff' fontSize='1rem'>
            <CorpLogo src={naver} alt='naver' />
            네이버 로그인
          </Button>
          <Button bg='#fee500' color='#3c1e1e' fontSize='1rem'>
            <CorpLogo src={kakao} alt='kakao' />
            카카오 로그인
          </Button>
        </EasyLoginBar>
      </LoginModalWrapper>
      <ModalBackground />
    </>
  );
}

const LoginModalWrapper = styled.div`
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

const ModalTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 3rem;
`;

const InputBar = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
`;

const UserInput = styled.input`
  height: 3.5rem;
  padding: 0 1rem;
  border: 1px solid #ffffff;
  border-radius: 0.2rem;
  background-color: transparent;
  outline: none;

  font-size: 1rem;
  color: #ffffff;

  &::placeholder {
    color: #ffffff;
  }
`;

const CheckBar = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  display: flex;
  justify-content: left;
  align-items: center;
  gap: 0.5rem;

  font-size: 1rem;
  color: #ffffff;
`;

const Button = styled.div`
  width: 100%;
  height: 3.5rem;
  border-radius: 0.2rem;
  background-color: ${(props) => props.bg};

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
`;

const HelpBar = styled.div`
  width: 100%;
  margin-top: 1rem;

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
  margin-top: 4rem;

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
