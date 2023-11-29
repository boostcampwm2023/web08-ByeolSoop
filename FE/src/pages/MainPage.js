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
  const setShapeState = useSetRecoilState(shapeAtom);

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
              data: await res.text(),
            })),
          );

          console.log(await Promise.all(shapeDataList));
          setShapeState(await Promise.all(shapeDataList));
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
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 100 100'
        width='4rem'
        height='4rem'
      >
        <defs>
          <style>{`.cls-1{fill:none;stroke:gray;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.06px;}`}</style>
        </defs>
        <polygon
          className='cls-1'
          points='50 23.94 58.31 41.69 76.06 50 58.31 58.31 50 76.06 41.69 58.31 23.94 50 41.69 41.69 50 23.94'
        />
      </svg>
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
