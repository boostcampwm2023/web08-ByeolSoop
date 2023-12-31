import React, { useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import headerAtom from "../../atoms/headerAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import ModalTitle from "../../styles/Modal/ModalTitle";
import ModalButton from "../../styles/Modal/ModalButton";
import ModalInputBox from "../../styles/Modal/ModalInputBox";
import ModalBackground from "../ModalBackground/ModalBackground";
import kakao from "../../assets/kakao.png";
import naver from "../../assets/naver.png";

function LoginModal() {
  const setUserState = useSetRecoilState(userAtom);
  const setHeaderState = useSetRecoilState(headerAtom);
  const [userId, setUserId] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [password, setPassword] = useState("");
  const errorRef = useRef();

  const { mutate: login } = useMutation(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          setHeaderState((prev) => ({
            ...prev,
            isLogin: false,
            isSignUp: false,
          }));
          setUserState((prev) => ({
            ...prev,
            isLogin: true,
            accessToken: data.accessToken,
            nickname: data.nickname,
          }));
          if (keepLogin) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("nickname", data.nickname);
          } else {
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("nickname", data.nickname);
          }
        } else {
          errorRef.current.innerText = data.message;
        }
      });
  });

  function checkValid() {
    if (userId === "") {
      errorRef.current.innerText = "아이디를 입력해주세요";
      return;
    }

    if (password === "") {
      errorRef.current.innerText = "비밀번호를 입력해주세요";
      return;
    }

    const idRegex = /^[A-Za-z0-9_-]{5,20}$/;
    const pwRegex = /^[A-Za-z0-9!@#$%^&*()_+=-~]{5,20}$/;
    if (!idRegex.test(userId) || !pwRegex.test(password)) {
      errorRef.current.innerText = "존재하지 않는 아이디입니다.";
      return;
    }

    login();
  }

  const naverLogin = () => {
    const NAVER_LOGIN_URL =
      `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code&client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}` +
      `&state=test&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}` +
      `/auth/naver/callback`;

    window.location.href = NAVER_LOGIN_URL;
  };

  const kakaoLogin = () => {
    const KAKAO_LOGIN_URL =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}` +
      `&redirect_uri=${process.env.REACT_APP_FRONTEND_URL}` +
      `/auth/kakao/callback&response_type=code`;

    window.location.href = KAKAO_LOGIN_URL;
  };

  return (
    <>
      <ModalWrapper $left='50%' width='25rem' height='40rem'>
        <ModalTitle>로그인</ModalTitle>
        <InputBar>
          <ModalInputBox
            type='text'
            placeholder='아이디를 입력하세요'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkValid();
              }
            }}
          />
          <ModalInputBox
            type='password'
            placeholder='비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkValid();
              }
            }}
          />
          <CheckBar>
            <input
              type='checkbox'
              checked={keepLogin}
              onChange={() => {
                setKeepLogin((prev) => !prev);
              }}
            />
            <div>로그인 유지</div>
          </CheckBar>
        </InputBar>
        <ModalButtonContainer>
          <div id='login-error' style={{ color: "red" }} ref={errorRef} />
          <ModalButton type='button' onClick={() => checkValid()}>
            로그인
          </ModalButton>
        </ModalButtonContainer>
        <HelpBar
          onClick={() => {
            setHeaderState((prev) => ({
              ...prev,
              isLogin: false,
              isSignUp: true,
            }));
          }}
        >
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
          <ModalButton
            $bg='#03c75a'
            fontSize='1rem'
            onClick={() => {
              naverLogin();
            }}
          >
            <CorpLogo src={naver} alt='naver' />
            네이버 로그인
          </ModalButton>
          <ModalButton
            $bg='#fee500'
            color='#3c1e1e'
            fontSize='1rem'
            onClick={() => {
              kakaoLogin();
            }}
          >
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

const ModalButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  gap: 0.5rem;
  height: 6rem;
  margin-top: -1rem;
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

  cursor: pointer;
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
