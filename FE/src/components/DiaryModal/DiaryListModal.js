import React, { useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

function DiaryListModal() {
  const [selectedDiary, setSelectedDiary] = React.useState(null);
  const {
    data: DiaryList,
    // error,
    isLoading,
  } = useQuery("diaryList", () =>
    fetch("http://localhost:3000/data/data.json").then((res) => res.json()),
  );

  useEffect(() => {
    if (DiaryList) {
      setSelectedDiary(DiaryList[0]);
    }
  }, [DiaryList]);

  if (isLoading) return <div>로딩중...</div>;

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
        {DiaryList?.map((diary) => (
          <DiaryTitleListItem
            key={diary.id}
            onClick={() => {
              setSelectedDiary(diary);
            }}
          >
            {diary.title}
          </DiaryTitleListItem>
        ))}
      </DiaryListModalItem>
      <DiaryListModalItem width='50%'>
        <DiaryTitle>{selectedDiary?.title}</DiaryTitle>
        <DiaryContent>{selectedDiary?.content}</DiaryContent>
      </DiaryListModalItem>
    </DiaryListModalWrapper>
  );
}

const DiaryListModalWrapper = styled.div`
  width: 95%;
  height: 97.5%;
  position: absolute;
  top: 2.5%;
  left: 2.5%;
  z-index: 1001;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1%;
`;

const DiaryListModalItem = styled.div`
  width: ${(props) => props.width || "25%"};
  height: 85%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 1.3rem;
  color: #ffffff;
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

  font-size: 1.1rem;
`;

const DiaryTitleListItem = styled.div`
  width: 100%;
  height: 4.5rem;
  border-top: 1px solid #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const DiaryTitle = styled.div`
  width: 100%;
  height: 4.5rem;
  padding-left: 3rem;

  display: flex;
  align-items: center;

  font-size: 1.3rem;
`;

const DiaryContent = styled.div`
  width: 100%;
  height: 4.5rem;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.1rem;
`;

export default DiaryListModal;
