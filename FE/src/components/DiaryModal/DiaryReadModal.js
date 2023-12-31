import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import userAtom from "../../atoms/userAtom";
import shapeAtom from "../../atoms/shapeAtom";
import lastPageAtom from "../../atoms/lastPageAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import Tag from "../../styles/Modal/Tag";
import DiaryDeleteModal from "./DiaryDeleteModal";
import DiaryEmotionIndicator from "./EmotionIndicator/DiaryEmotionIndicator";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import close from "../../assets/close.svg";
import ModalBackground from "../ModalBackground/ModalBackground";
import handleResponse from "../../utils/handleResponse";

async function getDiary(accessToken, diaryUuid, setUserState, setDiaryState) {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries/${diaryUuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) =>
    handleResponse(res, accessToken, {
      successStatus: 200,
      onSuccessCallback: () => res.json(),
      on403Callback: () => {
        setDiaryState((prev) => ({
          ...prev,
          isRedirect: true,
        }));
      },
      on401Callback: (accessToken) => {
        setUserState((prev) => ({
          ...prev,
          accessToken,
        }));
      },
    }),
  );
}

function DiaryReadModal(props) {
  const { refetch, pointsRefetch } = props;
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const [userState, setUserState] = useRecoilState(userAtom);
  const [lastPageState, setLastPageState] = useRecoilState(lastPageAtom);
  const shapeState = useRecoilValue(shapeAtom);
  const [shapeData, setShapeData] = useState("");

  const { data, isLoading, isError } = useQuery(
    ["diary", userState.accessToken],
    () =>
      getDiary(
        userState.accessToken,
        diaryState.diaryUuid,
        setUserState,
        setDiaryState,
      ),
    {
      onSuccess: (loadedData) => {
        const foundShapeData = shapeState.find(
          (item) => item.uuid === loadedData.shapeUuid,
        );
        if (foundShapeData) {
          // 긍정 - 00ccff, 부정 - d1180b, 중립 - ba55d3
          const shapeColor = {
            positive: "#618CF7",
            neutral: "#A848F6",
            negative: "#E5575B",
          };
          setShapeData(
            foundShapeData.data.replace(
              /fill="#fff"/g,
              `fill="${shapeColor[loadedData.emotion.sentiment]}"`,
            ),
          );
        }
      },
    },
  );

  if (isLoading)
    return (
      <ModalWrapper $left='50%' width='40vw' height='65vh'>
        Loading...
      </ModalWrapper>
    );

  if (isError)
    return (
      <ModalWrapper $left='50%' width='40vw' height='65vh'>
        에러 발생
      </ModalWrapper>
    );

  return (
    <>
      <ModalBackground $opacity='0' />
      <ModalWrapper $left='50%' width='40vw' height='65vh'>
        <DiaryModalHeader>
          <DiaryModalTitleWrapper>
            <DateInfo>
              {data.date?.slice(2, 4)}.{data.date?.slice(5, 7)}.
              {data.date?.slice(8, 10)}
            </DateInfo>
            <DiaryModalTitle>{data.title}</DiaryModalTitle>
          </DiaryModalTitleWrapper>
          <DiaryButton
            onClick={() => {
              setDiaryState((prev) => ({
                ...prev,
                isRead: false,
                isUpdate: true,
              }));
            }}
          >
            <img
              src={editIcon}
              alt='edit'
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
            />
          </DiaryButton>
          <DiaryButton
            onClick={() => {
              setDiaryState((prev) => ({
                ...prev,
                isDelete: true,
              }));
            }}
          >
            <img
              src={deleteIcon}
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
              alt='delete'
            />
          </DiaryButton>
        </DiaryModalHeader>
        <DiaryModalContent>{data.content}</DiaryModalContent>
        <DiaryModalTagBar>
          <DiaryModalTagName>태그</DiaryModalTagName>
          <DiaryModalTagList>
            {data.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </DiaryModalTagList>
        </DiaryModalTagBar>
        <DiaryModalEmotionBar>
          <DiaryEmotionIndicator
            emotion={{
              positive: data.emotion?.positive,
              neutral: data.emotion?.neutral,
              negative: data.emotion?.negative,
            }}
            text
          />
          <DiaryModalIcon>
            <div
              dangerouslySetInnerHTML={{ __html: shapeData }}
              style={{ width: "100%", height: "100%" }}
            />
          </DiaryModalIcon>
        </DiaryModalEmotionBar>
        {diaryState.isDelete ? (
          <DiaryDeleteModal refetch={refetch} pointsRefetch={pointsRefetch} />
        ) : null}
        <ModalSideButtonWrapper>
          <ModalSideButton
            onClick={() => {
              if (lastPageState[lastPageState.length - 1] === "main") {
                setDiaryState((prev) => ({
                  ...prev,
                  isRead: false,
                }));
              } else if (lastPageState[lastPageState.length - 1] === "list") {
                setDiaryState((prev) => ({
                  ...prev,
                  isList: true,
                  isRead: false,
                }));
              }
              setLastPageState((prev) => prev.slice(0, prev.length - 1));
            }}
          >
            <img src={close} alt='close' />
          </ModalSideButton>
        </ModalSideButtonWrapper>
      </ModalWrapper>
    </>
  );
}

const DiaryModalHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DiaryModalTitleWrapper = styled.div`
  flex-grow: 1;
  width: 70%;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DiaryModalTitle = styled.div`
  width: 100%;
  font-size: 1.5rem;
  height: 2.5rem;

  overflow-x: auto;
  white-space: nowrap;
`;

const DiaryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 100%;
  border: hidden;
  background: none;

  color: rgba(255, 255, 255, 0.2);
  font-size: 1rem;

  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    transition: transform 0.25s;
  }
`;

const DiaryModalContent = styled.div`
  width: 100%;
  height: 60%;
  line-height: 1.8rem;
  overflow-y: auto;

  white-space: pre-wrap;
`;

const DiaryModalTagName = styled.div`
  width: 3rem;
  font-size: 1rem;
`;

const DiaryModalTagBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const DiaryModalTagList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  overflow-y: auto;
`;

const DiaryModalEmotionBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 5rem;
  flex-wrap: wrap;
`;

const ModalSideButtonWrapper = styled.div`
  width: 5rem;
  height: 100%;

  position: absolute;
  top: 0;
  right: -6rem;

  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const ModalSideButton = styled.div`
  width: ${(props) => props.width || "2.5rem"};
  height: 2.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  z-index: 1001;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const DiaryModalIcon = styled.div`
  width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateInfo = styled.div`
  width: 30%;

  position: relative;
  top: -0.5rem;

  font-size: 0.8rem;
  color: #ffffff80;
`;

export default DiaryReadModal;
