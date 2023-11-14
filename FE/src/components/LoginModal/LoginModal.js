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
          <UserInput defaultValue='아이디를 입력하세요' />
          <UserInput defaultValue='비밀번호를 입력하세요' />
        </InputBar>
        <CheckBar>
          <input type='checkbox' />
          <div>로그인 유지</div>
        </CheckBar>
        <Button bg='#3b4874' color='#ffffff' fontSize='1rem'>
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
          <Button bg='#03c75a' color='#ffffff'>
            <CorpLogo src={naver} alt='naver' />
            네이버 로그인
          </Button>
          <Button bg='#fee500' color='#3c1e1e'>
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
  width: 25rem;
  height: 40rem;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(7px);
  z-index: 1001;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ModalTitle = styled.h1`
  width: 20rem;
  margin-bottom: 2.5rem;

  font-size: 2rem;
  color: #ffffff;
`;

const InputBar = styled.div`
  width: 20rem;
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  font-size: 1rem;
  color: #ffffff;
`;

const UserInput = styled.input`
  width: 18rem;
  height: 3rem;
  padding: 0 1rem;
  border: 1px solid #ffffff;
  border-radius: 0.5rem;
  background: none;

  font-size: 1rem;
  color: #ffffff;
`;

const CheckBar = styled.div`
  width: 20rem;
  margin-top: 1rem;
  margin-bottom: 2rem;

  display: flex;
  justify-content: left;
  align-items: center;
  gap: 1rem;

  font-size: 0.8rem;
  color: #ffffff;
`;

const Button = styled.div`
  width: 20rem;
  height: 3rem;
  border-radius: 0.3rem;
  background-color: ${(props) => props.bg};

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
`;

const HelpBar = styled.div`
  width: 13rem;
  margin-top: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 0.8rem;
  color: #ffffff;
`;

const HelpBarBorder = styled.div`
  width: 1.2px;
  height: 1rem;
  background-color: #ffffff;
`;

const EasyLoginBar = styled.div`
  width: 20rem;
  margin-top: 3rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  font-size: 0.8rem;
  color: #ffffff;
`;

const EasyLoginBarTitle = styled.div`
  width: 20rem;
  margin-bottom: 1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const EasyLoginBarBorder = styled.div`
  width: 6.7rem;
  height: 1px;
  background-color: #ffffff;
`;

const CorpLogo = styled.img`
  width: 1rem;
  height: 1rem;
`;

export default LoginModal;
