import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import headerAtom from "../../atoms/headerAtom";
import logo from "../../assets/logo.png";

function Header() {
  const setHeaderState = useSetRecoilState(headerAtom);

  return (
    <HeaderWrapper>
      <HeaderLogo
        src={logo}
        onClick={() => {
          window.location.href = "/";
        }}
        alt='logo'
      />
      <LoginBar>
        <LoginItem
          onClick={() => {
            setHeaderState({
              isLogin: false,
              isSignUp: true,
            });
          }}
        >
          회원가입
        </LoginItem>
        <LoginItem
          onClick={() => {
            setHeaderState({
              isLogin: true,
              isSignUp: false,
            });
          }}
        >
          로그인
        </LoginItem>
      </LoginBar>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  height: 5rem;

  position: absolute;
  top: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;
`;

const HeaderLogo = styled.img`
  width: 10rem;
  margin-left: 3rem;

  cursor: pointer;
`;

const LoginBar = styled.div`
  margin-right: 3rem;

  display: flex;
  justify-content: space-between;
  gap: 3rem;

  font-size: 1rem;
  text-align: center;
  color: #ffffff;
`;

const LoginItem = styled.div`
  cursor: pointer;
`;

export default Header;
