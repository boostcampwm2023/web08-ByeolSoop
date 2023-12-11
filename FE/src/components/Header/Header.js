import React from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import headerAtom from "../../atoms/headerAtom";
import userAtom from "../../atoms/userAtom";
import SideBar from "../SideBar/SideBar";
import logo from "../../assets/logo.png";
import sideBarImg from "../../assets/side-bar.png";

function Header() {
  const [HeaderState, setHeaderState] = useRecoilState(headerAtom);
  const userState = useRecoilValue(userAtom);

  return (
    <>
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
                setHeaderState((prev) => ({
                  ...prev,
                  isLogin: false,
                  isSignUp: true,
                }));
              }}
            >
              회원가입
            </LoginItem>
            <LoginItem
              onClick={() => {
                setHeaderState((prev) => ({
                  ...prev,
                  isLogin: true,
                  isSignUp: false,
                }));
              }}
            >
              로그인
            </LoginItem>
          </LoginBar>
        ) : (
          <SideBarImg
            src={sideBarImg}
            alt='side-bar'
            onClick={() => {
              setHeaderState((prev) => ({
                ...prev,
                isSideBar: !HeaderState.isSideBar,
              }));
            }}
          />
        )}
      </HeaderWrapper>
      {HeaderState.isSideBar ? <SideBar /> : null}
    </>
  );
}

const HeaderWrapper = styled.header`
  width: 100%;
  height: 5rem;
  z-index: 1004;

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
  margin-top: 1rem;

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
