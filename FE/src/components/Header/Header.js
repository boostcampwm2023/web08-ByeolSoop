import React from "react";
import styled from "styled-components";
import { useSetRecoilState, useRecoilValue } from "recoil";
import headerAtom from "../../atoms/headerAtom";
import userAtom from "../../atoms/userAtom";
import logo from "../../assets/logo.png";
import sideBar from "../../assets/side-bar.png";

function Header() {
  const setHeaderState = useSetRecoilState(headerAtom);
  const userState = useRecoilValue(userAtom);

  return (
    <HeaderWrapper>
      <HeaderLogo
        src={logo}
        onClick={() => {
          window.location.href = "/";
        }}
        alt='logo'
      />
      {!userState.isLogin ? (
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
      ) : (
        <SideBarImg src={sideBar} alt='side-bar' />
      )}
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

const SideBarImg = styled.img`
  width: 1.8rem;
  height: 1.4rem;

  margin-right: 3rem;

  cursor: pointer;
`;

export default Header;
