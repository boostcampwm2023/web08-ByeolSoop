import React from "react";
import styled from "styled-components";
import { useSetRecoilState, useRecoilState } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import headerAtom from "../../atoms/headerAtom";
import userAtom from "../../atoms/userAtom";
import starAtom from "../../atoms/starAtom";
import boostcampImg from "../../assets/boostcamp.png";

function SidebarButton(props) {
  const setHeaderState = useSetRecoilState(headerAtom);
  const { text, onClick } = props;

  return (
    <SideBarContent
      onClick={() => {
        setHeaderState((prev) => ({
          ...prev,
          isSideBar: false,
        }));
        onClick();
      }}
    >
      {text}
    </SideBarContent>
  );
}

function SideBar() {
  const setDiaryState = useSetRecoilState(diaryAtom);
  const setHeaderState = useSetRecoilState(headerAtom);
  const [userState, setUserState] = useRecoilState(userAtom);
  const setStarState = useSetRecoilState(starAtom);
  const sideBarList = [
    {
      text: "나의 별숲",
      onClick: () => {
        setDiaryState((prev) => ({
          ...prev,
          isRead: false,
          isList: false,
          isAnalysis: false,
          isPurchase: false,
        }));
      },
    },
    {
      text: "별숲 목록",
      onClick: () => {
        setDiaryState((prev) => ({
          ...prev,
          isCreate: false,
          isRead: false,
          isUpdate: false,
          isList: true,
          isAnalysis: false,
          isPurchase: false,
        }));
        setStarState((prev) => ({
          ...prev,
          mode: "create",
        }));
      },
    },
    {
      text: "별숲 현황",
      onClick: () => {
        setDiaryState((prev) => ({
          ...prev,
          isCreate: false,
          isRead: false,
          isUpdate: false,
          isList: false,
          isAnalysis: true,
          isPurchase: false,
        }));
        setStarState((prev) => ({
          ...prev,
          mode: "create",
        }));
      },
    },
    {
      text: "별숲 상점",
      onClick: () => {
        setDiaryState((prev) => ({
          ...prev,
          isCreate: false,
          isRead: false,
          isUpdate: false,
          isList: false,
          isAnalysis: false,
          isPurchase: true,
        }));
        setStarState((prev) => ({
          ...prev,
          mode: "create",
        }));
      },
    },
    {
      text: "도움말",
      onClick: () => {
        window.open(
          "https://byeolsoop.notion.site/" +
            "551e1070f73a405badb8aeb178dac192?pvs=4",
          "_blank",
        );
      },
    },
  ];

  return (
    <AnimationWrapper>
      <SideBarWrapper>
        <SideBarContentWrapper>
          {sideBarList.map((item) => (
            <SidebarButton
              key={item.text}
              text={item.text}
              onClick={item.onClick}
            />
          ))}
        </SideBarContentWrapper>
        <LogOutButton
          onClick={() => {
            setHeaderState((prev) => ({
              ...prev,
              isSideBar: false,
            }));
            setUserState((prev) => ({
              ...prev,
              isLogin: false,
              accessToken: "",
            }));
            localStorage.removeItem("accessToken");
            localStorage.removeItem("nickname");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("nickname");
          }}
        >
          로그아웃
        </LogOutButton>
        {!userState.isPremium ? (
          <Ad
            src={boostcampImg}
            alt='boostcamp'
            onClick={() => {
              window.location.href = "https://boostcamp.connect.or.kr/";
            }}
          />
        ) : null}
      </SideBarWrapper>
      <SideBarBackground
        onClick={() => {
          setHeaderState((prev) => ({
            ...prev,
            isSideBar: false,
          }));
        }}
      />
    </AnimationWrapper>
  );
}

const AnimationWrapper = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 1003;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

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

  overflow: auto;

  animation: slideIn 0.5s ease-in-out;
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0%);
    }
  }
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

  font-family: "Pretendard-Medium";
  font-size: 1.2rem;
  color: #aeaeae;
  box-sizing: border-box;

  cursor: pointer;
`;

export default SideBar;
