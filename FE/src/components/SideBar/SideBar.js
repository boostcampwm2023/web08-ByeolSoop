import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import headerAtom from "../../atoms/headerAtom";
import userAtom from "../../atoms/userAtom";
import boostcampImg from "../../assets/boostcamp.png";

function SideBar() {
  const setHeaderState = useSetRecoilState(headerAtom);
  const setUserState = useSetRecoilState(userAtom);

  return (
    <>
      <SideBarWrapper>
        <SideBarContentWrapper>
          <SideBarContent>일기 쓰기</SideBarContent>
          <SideBarContent>일기 목록</SideBarContent>
          <SideBarContent>일기 분석</SideBarContent>
          <SideBarContent>환경 설정</SideBarContent>
          <SideBarContent>별숲 상점</SideBarContent>
        </SideBarContentWrapper>
        <LogOutButton
          onClick={() => {
            setHeaderState({
              isLogin: false,
              isSignUp: false,
              isSideBar: false,
            });
            setUserState((prev) => ({
              ...prev,
              isLogin: false,
              accessToken: "",
            }));
          }}
        >
          로그아웃
        </LogOutButton>
        <Ad
          src={boostcampImg}
          alt='boostcamp'
          onClick={() => {
            window.location.href = "https://boostcamp.connect.or.kr/";
          }}
        />
      </SideBarWrapper>
      <SideBarBackground />
    </>
  );
}

const SideBarWrapper = styled.div`
  width: 15rem;
  height: 100vh;
  padding-top: 5rem;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1003;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
`;

const SideBarBackground = styled.div`
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(3.5px);
  z-index: 1002;
  position: absolute;
  top: 0;
  left: 0;
`;

const SideBarContentWrapper = styled.div`
  width: 100%;

  cursor: pointer;
`;

const SideBarContent = styled.div`
  width: 100%;
  height: 4rem;
  padding-left: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-size: 1.2rem;
  color: #ffffff;
  box-sizing: border-box;

  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Ad = styled.img`
  width: 100%;

  cursor: pointer;
`;

const LogOutButton = styled.button`
  margin-top: 5rem;
  margin-bottom: 3rem;
  border: none;
  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  font-size: 1.2rem;
  color: #aeaeae;
  box-sizing: border-box;

  cursor: pointer;
`;

export default SideBar;
