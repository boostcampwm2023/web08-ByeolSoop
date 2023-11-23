import React, { useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import diaryAtom from "../../atoms/diaryAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import DiaryModalHeader from "../../styles/Modal/DiaryModalHeader";
import deleteIcon from "../../assets/deleteIcon.svg";

async function getShapeFn() {
  return fetch("http://223.130.129.145:3005/shapes/default", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function updateDiaryFn(data) {
  return fetch("http://223.130.129.145:3005/diaries", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
    body: JSON.stringify(data.diaryData),
  }).then((res) => res.json());
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

// TODO: 일기 데이터 수정 API 연결
function DiaryUpdateModal() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [isInput, setIsInput] = React.useState(true);
  const userState = useRecoilValue(userAtom);
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const [diaryData, setDiaryData] = React.useState({
    title: "test",
    content: "test",
    date: "2023-11-20",
    point: "0,0,0",
    tags: [],
    shapeUuid: "cf3a074a-0707-40c4-a598-c7c17a654476",
    uuid: diaryState.diaryUuid,
  });

  const closeModal = () => {
    setDiaryState((prev) => ({ ...prev, isUpdate: false }));
  };

  const addTag = (e) => {
    if (e.target.value.length > 0 && !diaryData.tags.includes(e.target.value)) {
      setDiaryData({
        ...diaryData,
        tags: [...diaryData.tags, e.target.value],
      });
    }
    e.target.value = "";
  };

  const deleteTag = (e) => {
    setDiaryData({
      ...diaryData,
      tags: diaryData.tags.filter((tag) => tag !== e.target.innerText),
    });
  };

  const deleteLastTag = () => {
    setDiaryData({ ...diaryData, tags: diaryData.tags.slice(0, -1) });
  };

  const {
    data: shapeData,
    // isLoading: shapeIsLoading,
    // isError: shapeIsError,
  } = useQuery("shape", getShapeFn);

  const {
    mutate: updateDiary,
    // isLoading: diaryIsLoading,
    // isError: diaryIsError,
  } = useMutation(updateDiaryFn);

  const {
    // data: originData,
    isLoading,
    isError,
  } = useQuery(
    "diary",
    () => getDiary(userState.accessToken, diaryState.diaryUuid),
    {
      onSuccess: (data) => {
        setDiaryData({
          ...diaryData,
          title: data.title,
          content: data.content,
          tags: data.tags,
        });
        titleRef.current.value = data.title;
        contentRef.current.value = data.content;
      },
    },
  );

  if (isLoading)
    return (
      <ModalWrapper left='60%' width='40vw' height='65vh' opacity='0.3'>
        Loading...
      </ModalWrapper>
    );

  if (isError)
    return (
      <ModalWrapper left='60%' width='40vw' height='65vh' opacity='0.3'>
        에러 발생
      </ModalWrapper>
    );

  return (
    <ModalWrapper left='60%' width='40vw' height='65vh' opacity='0.3'>
      <DiaryModalHeader>
        <DiaryModalTitle>바뀐 별의 이야기를 적어주세요.</DiaryModalTitle>
        <DiaryModalDate>
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </DiaryModalDate>
      </DiaryModalHeader>
      <DiaryModalInputBox
        ref={titleRef}
        fontSize='1.1rem'
        placeholder='제목을 입력해주세요.'
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setDiaryData({ ...diaryData, title: e.target.value });
            setIsInput(true);
          } else {
            setIsInput(false);
          }
        }}
      />
      <DiaryModalContentInputBox
        ref={contentRef}
        placeholder='내용을 입력해주세요.'
        onChange={(e) =>
          setDiaryData({ ...diaryData, content: e.target.value })
        }
      />
      <DiaryModalTagWrapper>
        {diaryData.tags.map((tag) => (
          <DiaryModalTagBox
            key={tag}
            onClick={(e) => {
              deleteTag(e);
            }}
          >
            {tag}
          </DiaryModalTagBox>
        ))}
        <DiaryModalTagInputBox
          fontSize='1rem'
          placeholder='태그를 입력해주세요.'
          onBlur={(e) => addTag(e)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTag(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && e.target.value.length === 0) {
              deleteLastTag();
            }
          }}
        />
      </DiaryModalTagWrapper>
      <DiaryModalShapeSelectBox shapeData={shapeData} />
      <ModalSideButtonWrapper>
        <ModalSideButton onClick={closeModal}>
          <img src={deleteIcon} alt='delete' />
        </ModalSideButton>
        {isInput ? (
          <ModalSideButton
            width='5rem'
            onClick={() => {
              updateDiary({ diaryData, accessToken: userState.accessToken });
              closeModal();
            }}
          >
            저장
          </ModalSideButton>
        ) : null}
      </ModalSideButtonWrapper>
    </ModalWrapper>
  );
}

function DiaryModalShapeSelectBox(props) {
  const { shapeData } = props;

  return (
    <ShapeSelectBoxWrapper>
      <ShapeSelectTextWrapper>
        <DiaryModalTitle>모양</DiaryModalTitle>
        <ShapeSelectText>직접 그리기</ShapeSelectText>
      </ShapeSelectTextWrapper>
      <ShapeSelectItemWrapper>
        {shapeData?.map((shape) => (
          <ShapeSelectBoxItem key={shape.uuid}>
            {shape.shapePath}
          </ShapeSelectBoxItem>
        ))}
      </ShapeSelectItemWrapper>
    </ShapeSelectBoxWrapper>
  );
}

const ShapeSelectBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ShapeSelectTextWrapper = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
`;

const ShapeSelectText = styled.div`
  font-size: 1rem;
  color: #e6e6e6;

  cursor: pointer;
`;

const ShapeSelectItemWrapper = styled.div`
  width: 100%;
  height: 5rem;
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  overflow: auto;
  margin-bottom: 1rem;
`;

const ShapeSelectBoxItem = styled.div`
  width: 3rem;
  height: 3rem;

  cursor: pointer;
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
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  z-index: 1001;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transition: 0.25s;
  }
`;

const DiaryModalTitle = styled.h1`
  font-size: 1.5rem;
`;

const DiaryModalDate = styled.div`
  color: rgba(0, 0, 0, 0.55);
`;

const DiaryModalInputBox = styled.input`
  width: 100%;
  height: 3rem;
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;

  font-family: "Pretendard-Medium";
  font-size: ${(props) => props.fontSize};

  &::placeholder {
    color: #ffffff;
  }
`;

const DiaryModalContentInputBox = styled.textarea`
  width: 100%;
  height: ${(props) => props.height};
  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;

  flex-grow: 1;

  font-family: "Pretendard-Medium";
  font-size: 1rem;
  line-height: 1.8rem;

  resize: none;

  word_wrap: break-word;
  word-break: break-all;

  &::placeholder {
    color: #ffffff;
  }
`;

const DiaryModalTagWrapper = styled.div`
  width: 100%;

  border-radius: 0.2rem;
  border: 1px solid #ffffff;
  background-color: transparent;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  color: #ffffff;
  outline: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow: auto;
`;

const DiaryModalTagInputBox = styled.input`
  width: 8.5rem;
  padding: 0.5rem 0;
  border: none;
  background-color: transparent;
  color: #ffffff;
  outline: none;

  flex-grow: 1;

  font-family: "Pretendard-Medium";
  font-size: 1rem;

  &::placeholder {
    color: #ffffff;
  }
`;

const DiaryModalTagBox = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  border: 1px solid #ffffff;
  background-color: rgba(255, 255, 255, 0.3);

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export default DiaryUpdateModal;
