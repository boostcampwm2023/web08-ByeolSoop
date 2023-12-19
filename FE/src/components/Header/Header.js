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
      <HeaderWrapper position='left'>
        <HeaderLogo
          src={logo}
          onClick={() => {
            window.location.href = "/";
          }}
          alt='logo'
        />
      </HeaderWrapper>

      {!userState.isLogin ? (
        <HeaderWrapper position='right'>
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
        </HeaderWrapper>
      ) : (
        <HeaderWrapper position='right'>
          <NickName>{userState.nickname}님의 별숲</NickName>
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
        </HeaderWrapper>
      )}

      {HeaderState.isSideBar ? <SideBar /> : null}
    </>
  );
}

const HeaderWrapper = styled.header`
  height: 5rem;
  z-index: 1004;

  position: absolute;
  top: 0;
  ${(props) => (props.position === "left" ? "left: 0;" : "right: 0;")}

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

const NickName = styled.div`
  flex-shrink: 0;
  font-size: 1.2rem;
  font-weight: thin;
  color: #fff;
  margin-right: 2vw;
`;

export default Header;
