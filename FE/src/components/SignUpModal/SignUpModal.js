import React, { useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import styled from "styled-components";
import headerAtom from "../../atoms/headerAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import ModalTitle from "../../styles/Modal/ModalTitle";
import ModalButton from "../../styles/Modal/ModalButton";
import ModalInputBox from "../../styles/Modal/ModalInputBox";
import ModalBackground from "../ModalBackground/ModalBackground";
import SignUpRuleGuide from "./SignUpRuleGuide";

function SignUpModalInputComponent(props) {
  const { title, type, onChange } = props;
  return (
    <SignUpModalInput>
      <SignUpModalInputTitle>{title}</SignUpModalInputTitle>
      <ModalInputBox type={type} onChange={onChange} />
    </SignUpModalInput>
  );
}

function SignUpModal() {
  const setHeaderState = useSetRecoilState(headerAtom);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const errorRef = useRef();
  const signUpInputList = [
    {
      title: "* 아이디",
      type: "text",
      onChange: (e) => {
        setUserId(e.target.value);
      },
    },
    {
      title: "* 비밀번호",
      type: "password",
      onChange: (e) => {
        setPassword(e.target.value);
      },
    },
    {
      title: "* 비밀번호 확인",
      type: "password",
      onChange: (e) => {
        setPasswordCheck(e.target.value);
      },
    },
    {
      title: "* 이메일",
      type: "email",
      onChange: (e) => {
        setEmail(e.target.value);
      },
    },
    {
      title: "* 닉네임",
      type: "text",
      onChange: (e) => {
        setNickname(e.target.value);
      },
    },
  ];

  const { mutate: signUp } = useMutation(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password, email, nickname }),
    }).then(async (res) => {
      if (res.status === 204) {
        setHeaderState((prev) => ({
          ...prev,
          isLogin: true,
          isSignUp: false,
        }));
      } else {
        const data = await res.json();
        errorRef.current.innerText = data.message;
      }
    });
  });

  function checkValid() {
    if (userId === "") {
      errorRef.current.innerText = "아이디를 입력해주세요";
      return;
    }

    const idRegex = /^[A-Za-z0-9_-]{5,20}$/;
    if (!idRegex.test(userId)) {
      errorRef.current.innerText = `아이디 형식이 올바르지 않습니다.
      아이디는 5~20자의 영문 대소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.`;
      return;
    }

    if (password === "") {
      errorRef.current.innerText = "비밀번호를 입력해주세요";
      return;
    }

    const pwRegex = /^[A-Za-z0-9!@#$%^&*()_+=-~]{5,20}$/;
    if (!pwRegex.test(password)) {
      errorRef.current.innerText = `비밀번호 형식이 올바르지 않습니다.
      비밀번호는 5~20자의 영문 대소문자, 숫자, 특수문자만 사용 가능합니다.`;
      return;
    }

    if (passwordCheck === "") {
      errorRef.current.innerText = "비밀번호 확인을 입력해주세요";
      return;
    }

    if (password !== passwordCheck) {
      errorRef.current.innerText = "비밀번호가 일치하지 않습니다.";
      return;
    }

    if (email === "") {
      errorRef.current.innerText = "이메일을 입력해주세요";
      return;
    }

    const emailRegex = /^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;
    if (!emailRegex.test(email)) {
      errorRef.current.innerText = "이메일 형식이 올바르지 않습니다.";
      return;
    }

    if (nickname === "") {
      errorRef.current.innerText = "닉네임을 입력해주세요";
      return;
    }

    signUp();
  }

  return (
    <>
      <ModalBackground />
      <ModalWrapper $left='50%' width='25rem' height='40rem'>
        <SignUpModalHeaderWrapper>
          <SignUpModalTitleWrapper>
            <ModalTitle>회원가입</ModalTitle>
            <SignUpRuleGuide />
          </SignUpModalTitleWrapper>
          <SignUpModalSubtitle>당신의 이야기를 펼쳐보세요!</SignUpModalSubtitle>
        </SignUpModalHeaderWrapper>
        <SignUpModalInputWrapper>
          {signUpInputList.map((input) => (
            <SignUpModalInputComponent
              title={input.title}
              type={input.type}
              onChange={input.onChange}
            />
          ))}
        </SignUpModalInputWrapper>
        <ModalButtonContainer>
          <div id='sign-up-error' style={{ color: "red" }} ref={errorRef} />
          <ModalButton
            onClick={() => {
              checkValid();
            }}
          >
            가입하기
          </ModalButton>
        </ModalButtonContainer>
      </ModalWrapper>
    </>
  );
}

const SignUpModalHeaderWrapper = styled.div`
  width: 100%;
  height: 2.25rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const SignUpModalTitleWrapper = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  gap: 10%;
`;

const SignUpModalSubtitle = styled.div`
  font-size: 1rem;
`;

const SignUpModalInputWrapper = styled.div`
  width: 100%;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SignUpModalInput = styled.div`
  width: 100%;
`;

const SignUpModalInputTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  gap: 0.5rem;
  height: 6rem;
`;

export default SignUpModal;
