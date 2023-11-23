import React, { useEffect, useLayoutEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import diaryAtom from "../../atoms/diaryAtom";
import zoomIn from "../../assets/zoomIn.svg";

function DiaryListModal() {
  const [selectedDiary, setSelectedDiary] = React.useState(null);
  const userState = useRecoilValue(userAtom);
  const setDiaryState = useSetRecoilState(diaryAtom);

  const {
    data: DiaryList,
    isError,
    isLoading,
  } = useQuery("diaryList", () =>
    fetch("http://223.130.129.145:3005/diaries", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userState.accessToken}`,
      },
    }).then((res) => res.json()),
  );

  useLayoutEffect(() => {
    if (DiaryList) {
      setSelectedDiary(DiaryList[0]);
    }
  }, [DiaryList]);

  useEffect(() => {
    if (selectedDiary) {
      setDiaryState((prev) => ({
        ...prev,
        diaryUuid: selectedDiary?.uuid,
      }));
    }
  }, [selectedDiary]);

  if (isLoading)
    return (
      <DiaryListModalWrapper>
        <DiaryListModalItem />
        <DiaryListModalItem />
        <DiaryListModalItem width='50%' />
      </DiaryListModalWrapper>
    );

  if (isError)
    return (
      <DiaryListModalWrapper>
        <DiaryListModalItem />
        <DiaryListModalItem />
        <DiaryListModalItem width='50%'>
          일기 목록을 불러오는데 실패했습니다.
        </DiaryListModalItem>
      </DiaryListModalWrapper>
    );

  return (
    <DiaryListModalWrapper>
      <DiaryListModalItem>
        <DiaryListModalFilterWrapper>
          <DiaryTitleListHeader>날짜</DiaryTitleListHeader>
          <DiaryListModalFilterContent>필터</DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper>
          <DiaryTitleListHeader>감정</DiaryTitleListHeader>
          <DiaryListModalFilterContent>필터</DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper>
          <DiaryTitleListHeader>모양</DiaryTitleListHeader>
          <DiaryListModalFilterContent>필터</DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper>
          <DiaryTitleListHeader>태그</DiaryTitleListHeader>
          <DiaryListModalFilterContent>필터</DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
      </DiaryListModalItem>
      <DiaryListModalItem>
        <DiaryTitleListHeader>제목</DiaryTitleListHeader>
        <DiaryTitleListItemWrapper
          onMouseEnter={(e) => {
            e.target.focus();
          }}
        >
          {DiaryList?.map((diary) => (
            <DiaryTitleListItem
              key={diary.uuid}
              onClick={() => {
                setSelectedDiary(diary);
              }}
            >
              {diary.title}
            </DiaryTitleListItem>
          ))}
        </DiaryTitleListItemWrapper>
      </DiaryListModalItem>
      <DiaryListModalItem width='50%'>
        <DiaryTitle>
          {selectedDiary?.title}
          <DiaryTitleImg
            src={zoomIn}
            alt='zoom-in'
            onClick={() => {
              setDiaryState((prev) => ({
                ...prev,
                isRead: true,
                isList: false,
              }));
            }}
          />
        </DiaryTitle>
        <DiaryContent>{selectedDiary?.content}</DiaryContent>
      </DiaryListModalItem>
    </DiaryListModalWrapper>
  );
}

const DiaryListModalWrapper = styled.div`
  width: 95%;
  height: 97.5%;
  padding: 0 2.5%;
  position: absolute;
  top: 2.5%;
  z-index: 1001;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1%;
`;

const DiaryListModalItem = styled.div`
  width: ${(props) => props.width || "25%"};
  height: 85%;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 1.3rem;
  color: #ffffff;

  animation: modalFadeIn 0.5s;
  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DiaryListModalFilterWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 1.1rem;
`;

const DiaryListModalFilterContent = styled.div`
  width: 100%;
  height: 4.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const DiaryTitleListHeader = styled.div`
  width: 100%;
  height: 3.5rem;
  padding-left: 3rem;

  display: flex;
  align-items: center;

  flex-shrink: 0;

  font-size: 1.1rem;
`;

const DiaryTitleListItemWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;
`;

const DiaryTitleListItem = styled.div`
  width: 100%;
  height: 4.5rem;
  border-top: 0.5px solid #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const DiaryTitle = styled.div`
  width: 85%;
  height: 10rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 1.6rem;
`;

const DiaryTitleImg = styled.img`
  width: 1.3rem;
  height: 1.3rem;

  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    transition: transform 0.25s;
  }
`;

const DiaryContent = styled.div`
  width: 85%;
  height: 70%;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  font-size: 1.1rem;
  line-height: 1.8rem;

  overflow-y: auto;
`;

export default DiaryListModal;
