import React, { useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import diaryAtom from "../atoms/diaryAtom";
import shapeAtom from "../atoms/shapeAtom";
import userAtom from "../atoms/userAtom";
import DiaryCreateModal from "../components/DiaryModal/DiaryCreateModal";
import DiaryReadModal from "../components/DiaryModal/DiaryReadModal";
import DiaryListModal from "../components/DiaryModal/DiaryListModal";
import DiaryUpdateModal from "../components/DiaryModal/DiaryUpdateModal";
import DiaryLoadingModal from "../components/DiaryModal/DiaryLoadingModal";
import StarPage from "./StarPage";

function MainPage() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const setShapeState = useSetRecoilState(shapeAtom);

  const { refetch } = useQuery(
    "diaryList",
    () =>
      fetch("http://223.130.129.145:3005/diaries", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        setDiaryState((prev) => ({ ...prev, diaryList: data }));
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
      window.history.pushState(newState, "", "");
      return newState;
    });

    async function getShapeFn() {
      return fetch("http://223.130.129.145:3005/shapes/", {
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
              data: data[key].svg.replace(/<\?xml.*?\?>/, ""),
            }));
            return shapeList;
          });
        });
    }

    getShapeFn();
  }, []);

  return (
    <>
      <MainPageWrapper
        onClick={(e) => {
          e.preventDefault();
          setDiaryState((prev) => ({
            ...prev,
            isCreate: true,
            isRead: false,
            isUpdate: false,
            isList: false,
          }));
        }}
      />
      <StarPage />
      {diaryState.isCreate ? <DiaryCreateModal refetch={refetch} /> : null}
      {diaryState.isRead ? <DiaryReadModal refetch={refetch} /> : null}
      {diaryState.isUpdate ? <DiaryUpdateModal refetch={refetch} /> : null}
      {diaryState.isList ? <DiaryListModal /> : null}
      {diaryState.isLoading ? <DiaryLoadingModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const MainPageWrapper = styled.div`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default MainPage;
