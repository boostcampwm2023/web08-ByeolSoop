/* eslint-disable */

import React, { useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import diaryAtom from "../atoms/diaryAtom";
import shapeAtom from "../atoms/shapeAtom";
import userAtom from "../atoms/userAtom";
import starAtom from "../atoms/starAtom";
import lastPageAtom from "../atoms/lastPageAtom";
import DiaryCreateModal from "../components/DiaryModal/DiaryCreateModal";
import DiaryReadModal from "../components/DiaryModal/DiaryReadModal";
import DiaryListModal from "../components/DiaryModal/DiaryListModal";
import DiaryAnalysisModal from "../components/DiaryModal/DiaryAnalysisModal";
import DiaryUpdateModal from "../components/DiaryModal/DiaryUpdateModal";
import DiaryLoadingModal from "../components/DiaryModal/DiaryLoadingModal";
import PurchaseModal from "../components/PurchaseModal/PurchaseModal";
import StarPage from "./StarPage";
import { preventBeforeUnload } from "../utils/utils";

function MainPage() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const [userState, setUserState] = useRecoilState(userAtom);
  const setShapeState = useSetRecoilState(shapeAtom);
  const [loaded, setLoaded] = React.useState(false);
  const setStarState = useSetRecoilState(starAtom);

  const { refetch } = useQuery(
    ["diaryList", userState.accessToken],
    async () => {
      return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          setLoaded(true);
          return res.json();
        }
        if (res.status === 403) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

          localStorage.removeItem("accessToken");
          localStorage.removeItem("nickname");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("nickname");
          window.removeEventListener("beforeunload", preventBeforeUnload);
          window.location.href = "/";
        }
        if (res.status === 401) {
          return fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reissue`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userState.accessToken}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (localStorage.getItem("accessToken")) {
                localStorage.setItem("accessToken", data.accessToken);
              }
              if (sessionStorage.getItem("accessToken")) {
                sessionStorage.setItem("accessToken", data.accessToken);
              }
              setUserState((prev) => ({
                ...prev,
                accessToken: data.accessToken,
              }));
            });
        }
        return {};
      });
    },
    {
      onSuccess: (data) => {
        data.forEach((diary) => {
          diary.coordinate.x /= 100000;
          diary.coordinate.y /= 100000;
          diary.coordinate.z /= 100000;
        });

        setDiaryState((prev) => ({ ...prev, diaryList: data }));
      },
    },
  );

  const { refetch: pointsRefetch } = useQuery(
    "points",
    () =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}/lines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        data.forEach((point) => {
          const { first, second } = point;
          first.coordinate.x /= 100000;
          first.coordinate.y /= 100000;
          first.coordinate.z /= 100000;
          second.coordinate.x /= 100000;
          second.coordinate.y /= 100000;
          second.coordinate.z /= 100000;
        });

        setStarState((prev) => ({ ...prev, points: data }));
      },
    },
  );

  useEffect(() => {
    setDiaryState((prev) => {
      const newState = {
        ...prev,
        isCreate: false,
        isRead: false,
        isUpdate: false,
        isList: false,
      };
      return newState;
    });

    async function getShapeFn() {
      return fetch(`${process.env.REACT_APP_BACKEND_URL}/shapes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          setShapeState(() => {
            const shapeList = Object.keys(data).map((key) => ({
              uuid: data[key].uuid,
              data: data[key].svg,
            }));
            return shapeList;
          });
        });
    }

    if (loaded) {
      getShapeFn();
    }
  }, [loaded]);

  return (
    <div>
      {loaded ? (
        <>
          <NickNameWrapper>
            <NickName>{userState.nickname}님의 별숲</NickName>
          </NickNameWrapper>
          <StarPage refetch={refetch} pointsRefetch={pointsRefetch} />
          {diaryState.isCreate ? <DiaryCreateModal refetch={refetch} /> : null}
          {diaryState.isRead ? (
            <DiaryReadModal refetch={refetch} pointsRefetch={pointsRefetch} />
          ) : null}
          {diaryState.isUpdate ? <DiaryUpdateModal refetch={refetch} /> : null}
          {diaryState.isList ? <DiaryListModal /> : null}
          {diaryState.isAnalysis ? <DiaryAnalysisModal /> : null}
          {diaryState.isLoading ? <DiaryLoadingModal /> : null}
          {diaryState.isPurchase ? <PurchaseModal /> : null}
        </>
      ) : null}
    </div>
  );
}

const NickNameWrapper = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  position: absolute;
  top: 0;
  right: 5rem;

  z-index: 1001;
`;

const NickName = styled.div`
  font-size: 1.2rem;
  font-weight: thin;
  color: #fff;
  margin-right: 2vw;
`;

export default MainPage;
