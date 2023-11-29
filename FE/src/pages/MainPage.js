/* eslint-disable */

import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import diaryAtom from "../atoms/diaryAtom";
import shapeAtom from "../atoms/shapeAtom";
import userAtom from "../atoms/userAtom";
import DiaryCreateModal from "../components/DiaryModal/DiaryCreateModal";
import DiaryReadModal from "../components/DiaryModal/DiaryReadModal";
import background from "../assets/background.png";
import DiaryListModal from "../components/DiaryModal/DiaryListModal";
import DiaryUpdateModal from "../components/DiaryModal/DiaryUpdateModal";
import DiaryLoadingModal from "../components/DiaryModal/DiaryLoadingModal";

function MainPage() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const [shapeState, setShapeState] = useRecoilState(shapeAtom);

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
      return fetch("http://223.130.129.145:3005/shapes/default", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          const shapeDataList = data.map((shape) =>
            fetch(`http://223.130.129.145:3005/shapes/${shape.uuid}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userState.accessToken}`,
              },
            }).then(async (res) => ({
              uuid: shape.uuid,
              data: await res.text(),
            })),
          );

          setShapeState(
            await Promise.all(shapeDataList).then((res) =>
              res.map((shape) => {
                const newShape = {
                  ...shape,
                  data: shape.data.replace(/<\?xml.*?\?>/, ""),
                };
                return newShape;
              }),
            ),
          );
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
      {shapeState.map((shape) => (
        <div
          key={shape.uuid}
          dangerouslySetInnerHTML={{ __html: shape.data }}
        />
      ))}
      {diaryState.isCreate ? <DiaryCreateModal /> : null}
      {diaryState.isRead ? <DiaryReadModal /> : null}
      {diaryState.isUpdate ? <DiaryUpdateModal /> : null}
      {diaryState.isList ? <DiaryListModal /> : null}
      {diaryState.isLoading ? <DiaryLoadingModal /> : null}
    </>
  );
}

// TODO: 배경 이미지 제거하고 영상으로 대체할 것
const MainPageWrapper = styled.div`
  height: 100vh;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default MainPage;
