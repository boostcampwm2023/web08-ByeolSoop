import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import diaryAtom from "../../atoms/diaryAtom";
import shapeAtom from "../../atoms/shapeAtom";
import lastPageAtom from "../../atoms/lastPageAtom";
import zoomIn from "../../assets/zoomIn.svg";
import search from "../../assets/search.svg";

function DiaryListModal() {
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const shapeState = useRecoilValue(shapeAtom);
  const setLastPageState = useSetRecoilState(lastPageAtom);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [filterState, setFilterState] = useState({
    date: {
      start: null,
      end: null,
    },
    emotion: {
      positive: false,
      neutral: false,
      negative: false,
    },
    shape: [],
    tag: [],
  });
  const [filteredDiaryList, setFilteredDiaryList] = useState([]);

  useLayoutEffect(() => {
    if (diaryState.diaryList) {
      setSelectedDiary(diaryState.diaryList[0]);
      setFilteredDiaryList(diaryState.diaryList);
    }
  }, [diaryState.diaryList]);

  useEffect(() => {
    if (selectedDiary) {
      setDiaryState((prev) => ({
        ...prev,
        diaryUuid: selectedDiary?.uuid,
        diaryPoint: `${selectedDiary.coordinate.x * 100000},${
          selectedDiary.coordinate.y * 100000
        },${selectedDiary.coordinate.z * 100000}`,
      }));
    }
  }, [selectedDiary]);

  useEffect(() => {
    if (!diaryState.diaryList) return;

    const isDateInRange = (diaryDate) => {
      const startDateCondition =
        !filterState.date.start ||
        new Date(diaryDate) >= filterState.date.start;

      const endDateCondition =
        !filterState.date.end || new Date(diaryDate) <= filterState.date.end;

      return startDateCondition && endDateCondition;
    };

    const isEmotionMatch = (diaryEmotion) => {
      const { positive, neutral, negative } = filterState.emotion;

      return (
        (!positive && !neutral && !negative) ||
        (positive && diaryEmotion === "positive") ||
        (neutral && diaryEmotion === "neutral") ||
        (negative && diaryEmotion === "negative")
      );
    };

    const isShapeMatch = (diaryShapeUuid) =>
      filterState.shape.length === 0 ||
      filterState.shape.includes(diaryShapeUuid);

    const areTagsMatch = (diaryTags) =>
      filterState.tag.length === 0 ||
      filterState.tag.every((tag) => diaryTags.includes(tag));

    const filteredList = diaryState.diaryList.filter((diary) => {
      const isDateValid = isDateInRange(diary.date);
      const isEmotionValid = isEmotionMatch(diary.emotion.sentiment);
      const isShapeValid = isShapeMatch(diary.shapeUuid);
      const areTagsValid = areTagsMatch(diary.tags);

      return isDateValid && isEmotionValid && isShapeValid && areTagsValid;
    });

    setFilteredDiaryList([...filteredList]);
  }, [
    filterState.date,
    filterState.emotion,
    filterState.shape,
    filterState.tag,
  ]);

  const toggleEmotionFilter = (emotionType) => {
    setFilterState((prev) => ({
      ...prev,
      emotion: {
        ...prev.emotion,
        [emotionType]: !prev.emotion[emotionType],
      },
    }));
  };

  const emotionButtons = [
    { type: "positive", borderColor: "#00ccff", text: "긍정" },
    { type: "neutral", borderColor: "#ba55d3", text: "중립" },
    { type: "negative", borderColor: "#d1180b", text: "부정" },
  ];

  return (
    <DiaryListModalWrapper>
      <DiaryListModalItem $justifyContent='center'>
        <DiaryListModalFilterWrapper $height='17%'>
          <DiaryTitleListHeader>날짜</DiaryTitleListHeader>
          <DiaryListModalFilterContent>
            <DatePicker
              selected={filterState.date.start}
              onChange={(date) => {
                setFilterState((prev) => ({
                  ...prev,
                  date: {
                    ...prev.date,
                    start: date,
                  },
                }));
              }}
              dateFormat='yyyy-MM-dd'
              selectsStart
              startDate={filterState.date.start}
              endDate={filterState.date.end}
              locale={ko}
              isClearable
              placeholderText='시작 날짜'
            />
            <span>~</span>
            <DatePicker
              selected={filterState.date.end}
              onChange={(date) => {
                setFilterState((prev) => ({
                  ...prev,
                  date: {
                    ...prev.date,
                    end: date,
                  },
                }));
              }}
              dateFormat='yyyy-MM-dd'
              selectsEnd
              startDate={filterState.date.start}
              endDate={filterState.date.end}
              minDate={filterState.date.start}
              locale={ko}
              isClearable
              placeholderText='종료 날짜'
            />
          </DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper $height='17%'>
          <DiaryTitleListHeader>감정</DiaryTitleListHeader>
          <DiaryListModalFilterContent $height='50%'>
            {emotionButtons.map(({ type, borderColor, text }) => (
              <FilterEmotionButton
                key={type}
                selected={filterState.emotion[type]}
                $borderColor={borderColor}
                onClick={() => toggleEmotionFilter(type)}
              >
                {text}
              </FilterEmotionButton>
            ))}
          </DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper $height='28%'>
          <DiaryTitleListHeader>모양</DiaryTitleListHeader>
          <DiaryListModalFilterContent $height='70%'>
            <ShapeWrapper>
              {shapeState?.map((shape) => (
                <ShapeSelectBoxItem
                  key={shape.uuid}
                  onClick={() => {
                    setFilterState((prev) => {
                      const shapeIndex = prev.shape.indexOf(shape.uuid);
                      if (shapeIndex !== -1) {
                        const updatedShape = [...prev.shape];
                        updatedShape.splice(shapeIndex, 1);
                        return {
                          ...prev,
                          shape: updatedShape,
                        };
                      }
                      return {
                        ...prev,
                        shape: [...prev.shape, shape.uuid],
                      };
                    });
                  }}
                  selected={filterState.shape.includes(shape.uuid)}
                >
                  <div dangerouslySetInnerHTML={{ __html: shape.data }} />
                </ShapeSelectBoxItem>
              ))}
            </ShapeWrapper>
          </DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
        <DiaryListModalFilterWrapper $height='28%'>
          <DiaryTitleListHeader>태그</DiaryTitleListHeader>
          <DiaryListModalFilterContent $flexDirection='column'>
            <FilterTagInputWrapper>
              <FilterTagInputIcon>
                <img src={search} alt='search' />
              </FilterTagInputIcon>
              <FilterTagInput
                type='text'
                placeholder='태그를 입력하세요'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!filterState.tag.includes(e.target.value)) {
                      setFilterState((prev) => ({
                        ...prev,
                        tag: [...prev.tag, e.target.value],
                      }));
                    }
                  }
                }}
              />
            </FilterTagInputWrapper>
            <FilterTagWrapper>
              {filterState.tag.map((tag) => (
                <FilterTagItem
                  key={tag}
                  onClick={() => {
                    setFilterState((prev) => ({
                      ...prev,
                      tag: prev.tag.filter((item) => item !== tag),
                    }));
                  }}
                >
                  {tag}
                </FilterTagItem>
              ))}
            </FilterTagWrapper>
          </DiaryListModalFilterContent>
        </DiaryListModalFilterWrapper>
      </DiaryListModalItem>
      <DiaryListModalItem>
        <DiaryTitleListHeader>제목</DiaryTitleListHeader>
        <DiaryTitleListItemWrapper
          onMouseEnter={(e) => {
            e.target.focus();
          }}
        >
          {filteredDiaryList.map((diary) => {
            const shapeColor = {
              positive: "#618CF7",
              neutral: "#A848F6",
              negative: "#E5575B",
            };

            const shapeHTML = shapeState
              .find((shape) => shape.uuid === diary.shapeUuid)
              ?.data.replace(
                /fill="#fff"/g,
                `fill="${shapeColor[diary.emotion.sentiment]}"`,
              );

            return (
              <DiaryTitleListItem
                key={diary.uuid}
                onClick={() => {
                  setSelectedDiary(diary);
                }}
              >
                <DiaryTitleListItemShape>
                  <div
                    id={diary.uuid}
                    style={{
                      width: "6rem",
                      height: "6rem",
                      marginRight: "1rem",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: shapeHTML,
                    }}
                  />
                </DiaryTitleListItemShape>
                <DiarytitleListContent>
                  {diary.title}
                  <DiaryTitleTagList>
                    {diary.tags.map((tag) => (
                      <DiaryTitleTagItem key={tag}>#{tag}</DiaryTitleTagItem>
                    ))}
                  </DiaryTitleTagList>
                </DiarytitleListContent>
              </DiaryTitleListItem>
            );
          })}
        </DiaryTitleListItemWrapper>
      </DiaryListModalItem>
      <DiaryListModalItem $width='50%'>
        <DiaryTitle>
          <DateInfo>
            {selectedDiary?.date.slice(2, 4)}.{selectedDiary?.date.slice(5, 7)}.
            {selectedDiary?.date.slice(8, 10)}
          </DateInfo>
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
              setLastPageState(["list"]);
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
  width: ${(props) => props.$width || "25%"};
  height: 85%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(props) => props.$justifyContent || "flex-start"};

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

  overflow: hidden;
  overflow-y: auto;
`;

const DiaryListModalFilterWrapper = styled.div`
  width: 100%;
  height: ${(props) => props.$height || "100%"};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  font-size: 1.1rem;
`;

const DiaryListModalFilterContent = styled.div`
  width: 100%;
  height: ${(props) => props.$height || "100%"};

  display: flex;
  flex-direction: ${(props) => props.$flexDirection || "row"};
  justify-content: space-evenly;
  align-items: center;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-datepicker__input-container input {
    height: 3rem;
    width: 85%;

    border: 1px solid #ffffff;
    border-radius: 0.5rem;

    background-color: transparent;

    display: flex;
    justify-content: center;
    align-items: center;

    font-family: "Pretendard-Medium";

    padding: 0 1rem;
    box-sizing: border-box;

    color: #ffffff;

    &:focus {
      outline: none;
    }
  }

  .react-datepicker {
    border-radius: 0.5rem;

    font-family: "Pretendard-Medium";
    font-size: 0.8rem;

    background-color: #bbc2d4;

    width: 16rem;
    height: auto;
    padding: 0.5rem 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .react-datepicker__close-icon {
    right: 1rem;
  }

  .react-datepicker__close-icon::after {
    border-radius: 0%;
  }

  .react-datepicker__navigation--next {
    right: 2rem;
    top: 0.5rem;
  }

  .react-datepicker__navigation--previous {
    left: 2rem;
    top: 0.5rem;
  }

  .react-datepicker__navigation-icon--next::before,
  .react-datepicker__navigation-icon--previous::before {
    border-color: #000000;
    border-width: 0.15rem 0.15rem 0 0;
    width: 0.4rem;
    height: 0.4rem;
  }

  .react-datepicker__header {
    border-bottom: none;
    background-color: transparent;
    padding: 0;
    padding-top: 0.5rem;
  }

  .react-datepicker__day-names {
    background-color: #000000;
    border-radius: 0.5rem 0.5rem 0 0;
    margin: 0.4rem;
    margin-bottom: 0;
    margin-top: 1rem;
  }

  .react-datepicker__day-name {
    color: #ffffff;
  }

  .react-datepicker__month {
    background-color: #ffffff;
    border-radius: 0 0 0.5rem 0.5rem;
    margin-top: 0;
  }
`;

const FilterEmotionButton = styled.button`
  width: 25%;
  height: 50%;

  border: none;
  border-radius: 0.5rem;

  font-family: "Pretendard-Medium";
  font-size: 1.1rem;
  text-align: center;

  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  border: ${(props) =>
    props.selected ? `3px solid ${props.$borderColor}` : "none"};
  border-radius: 0.5rem;
`;

const ShapeWrapper = styled.div`
  width: 90%;
  height: 100%;

  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  background-color: #3b455e;
  border-radius: 0.5rem;

  overflow: auto;
  overflow-x: hidden;
`;

const ShapeSelectBoxItem = styled.div`
  width: 4rem;

  margin: 0.5rem;

  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    transition: transform 0.25s;
  }

  border: ${(props) =>
    props.selected ? "1px solid #ffffff" : "1px solid transparent"};
  border-radius: 0.5rem;
`;

const FilterTagInputWrapper = styled.div`
  width: 88%;
  height: 3rem;

  border: none;
  border-radius: 1.5rem;

  background-color: rgba(255, 255, 255, 0.6);

  font-family: "Pretendard-Medium";
  font-size: 1.1rem;

  padding: 0.5rem 1rem;
  box-sizing: border-box;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  margin-bottom: 1rem;
`;

const FilterTagInputIcon = styled.div`
  width: 2rem;
  height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilterTagInput = styled.input`
  width: 100%;
  height: 3rem;

  border: none;
  border-radius: 1.5rem;

  background-color: transparent;

  font-family: "Pretendard-Medium";
  font-size: 1.1rem;

  padding: 0.5rem 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;

const FilterTagWrapper = styled.div`
  width: 90%;
  height: 10rem;

  display: flex;
  flex-wrap: wrap;

  background-color: transparent;
  border-radius: 0.5rem;

  overflow: auto;
  overflow-x: hidden;
`;

const FilterTagItem = styled.div`
  height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1rem;

  padding: 0 1rem;
  margin: 0.5rem;

  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const DiaryTitleListHeader = styled.div`
  width: 100%;
  height: 3.5rem;
  padding-left: 3rem;

  display: flex;
  align-items: center;

  flex-shrink: 0;

  font-size: 1.6rem;
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
  height: 7rem;
  border-top: 0.5px solid #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 1rem;
  box-sizing: border-box;

  flex-shrink: 0;

  cursor: pointer;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const DiaryTitleListItemShape = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DiarytitleListContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;

  font-size: 1.5rem;

  overflow: hidden;
`;

const DiaryTitleTagList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DiaryTitleTagItem = styled.div`
  height: 1.5rem;

  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiaryTitle = styled.div`
  width: 85%;
  height: 8rem;

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

  white-space: pre-wrap;
`;

const DateInfo = styled.div`
  width: 30%;

  position: fixed;
  top: 2rem;

  font-size: 0.8rem;
  color: #ffffff80;
`;

export default DiaryListModal;
