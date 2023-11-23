import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import userAtom from "../../atoms/userAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import DiaryDeleteModal from "./DiaryDeleteModal";
import editIcon from "../../assets/edit.svg";
import deleteIcon from "../../assets/delete.svg";
import starIcon from "../../assets/star.svg";
import indicatorArrowIcon from "../../assets/indicator-arrow.svg";

function DiaryModalEmotionIndicator({ emotion }) {
  return (
    <EmotionIndicatorWrapper>
      <EmotionIndicatorBar>
        <EmotionIndicator ratio={`${emotion.positive}%`} color='#618CF7' />
        <EmotionIndicatorArrow>
          <img
            src={indicatorArrowIcon}
            alt='arrow'
            style={{ width: "1rem", height: "1rem" }}
          />
        </EmotionIndicatorArrow>
        <EmotionIndicator ratio={`${emotion.neutral}%`} color='#A848F6' />
        <EmotionIndicatorArrow>
          <img
            src={indicatorArrowIcon}
            alt='arrow'
            style={{ width: "1rem", height: "1rem" }}
          />
        </EmotionIndicatorArrow>
        <EmotionIndicator ratio={`${emotion.negative}%`} color='#E5575B' />
      </EmotionIndicatorBar>
      <EmotionTextWrapper>
        <EmotionText>긍정 {emotion.positive}%</EmotionText>
        <EmotionText>중립 {emotion.neutral}%</EmotionText>
        <EmotionText>부정 {emotion.negative}%</EmotionText>
      </EmotionTextWrapper>
    </EmotionIndicatorWrapper>
  );
}

async function getDiary(accessToken, diaryUuid) {
  return fetch(`http://223.130.129.145:3005/diaries/${diaryUuid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json());
}

function DiaryReadModal() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const { data, isLoading, isError } = useQuery("diary", () =>
    getDiary(userState.accessToken, diaryState.diaryUuid),
  );

  // TODO: 로딩, 에러 처리 UI 구현
  if (isLoading)
    return (
      <ModalWrapper left='67%' width='40vw' height='65vh' opacity='0.3'>
        Loading...
      </ModalWrapper>
    );
  if (isError)
    return (
      <ModalWrapper left='67%' width='40vw' height='65vh' opacity='0.3'>
        에러 발생
      </ModalWrapper>
    );

  return (
    <ModalWrapper left='67%' width='40vw' height='65vh' opacity='0.3'>
      <DiaryModalHeader>
        <DiaryModalTitle>{data.title}</DiaryModalTitle>
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
          {data.tags.map((tag) => (
            <DiaryModalTag key={tag}>{tag}</DiaryModalTag>
          ))}
        </DiaryModalTagList>
      </DiaryModalTagBar>
      <DiaryModalEmotionBar>
        <DiaryModalEmotionIndicator
          emotion={{
            positive: data.emotion.positive,
            neutral: data.emotion.neutral,
            negative: data.emotion.negative,
          }}
        />
        <DiaryModalIcon>
          <img
            src={starIcon}
            alt='star'
            style={{
              width: "5rem",
              height: "5rem",
            }}
          />
        </DiaryModalIcon>
      </DiaryModalEmotionBar>
      {diaryState.isDelete ? <DiaryDeleteModal /> : null}
    </ModalWrapper>
  );
}

// ToDo: 통합 필요
const DiaryModalHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DiaryModalTitle = styled.div`
  flex-grow: 1;
  font-size: 1.5rem;
  line-height: 1.8rem;
  width: 70%;

  overflow-x: auto;
  white-space: nowrap;
`;

const DiaryButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 2rem;
  border: hidden;
  background: none;

  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;

  gap: 0.5rem;
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

const DiaryModalTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  color: #ffffff;
  outline: none;
  white-space: nowrap;
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

const DiaryModalIcon = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmotionIndicatorWrapper = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const EmotionIndicatorBar = styled.div`
  width: 20rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EmotionIndicator = styled.div`
  width: ${(props) => props.ratio};
  height: 100%;
  background-color: ${(props) => props.color};
`;

const EmotionIndicatorArrow = styled.div`
  display: flex;
  justify-content: center;
  width: 0;
  height: 4rem;
`;

const EmotionTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmotionText = styled.div`
  font-size: 0.9rem;
`;

export default DiaryReadModal;
