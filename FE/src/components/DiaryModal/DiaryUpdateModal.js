/* eslint-disable */

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import diaryAtom from "../../atoms/diaryAtom";
import shapeAtom from "../../atoms/shapeAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import Calendar from "./Calendar";
import close from "../../assets/close.svg";
import getFormattedDate from "../../utils/utils";
import ModalBackground from "../ModalBackground/ModalBackground";

// TODO: 일기 데이터 수정 API 연결
function DiaryUpdateModal(props) {
  const { refetch } = props;
  const [userState, setUserState] = useRecoilState(userAtom);
  const [diaryState, setDiaryState] = useRecoilState(diaryAtom);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [isInput, setIsInput] = useState(true);
  const [diaryData, setDiaryData] = useState({
    uuid: diaryState.diaryUuid,
    title: "",
    content: "",
    date: "",
    point: diaryState.diaryPoint,
    tags: [],
    shapeUuid: diaryState.diaryList.find(
      (diary) => diary.uuid === diaryState.diaryUuid,
    )?.shapeUuid,
  });

  const {
    mutate: updateDiary,
    // isLoading: diaryIsLoading,
    // isError: diaryIsError,
  } = useMutation(updateDiaryFn);

  const {
    data: originData,
    isLoading,
    isError,
  } = useQuery("diary", () =>
    getDiary(userState.accessToken, diaryState.diaryUuid),
  );

  const closeModal = () => {
    setDiaryState((prev) => ({
      ...prev,
      isUpdate: false,
    }));
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

  async function updateDiaryFn(data) {
    const formattedDiaryData = {
      uuid: data.diaryData.uuid,
      title: data.diaryData.title,
      content: data.diaryData.content,
      date: getFormattedDate(data.diaryData.date),
      point: data.diaryData.point,
      tags: data.diaryData.tags,
      shapeUuid: data.diaryData.shapeUuid,
    };

    setDiaryState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify(formattedDiaryData),
    }).then((res) => {
      if (res.status === 204) {
        refetch();
        setDiaryState((prev) => ({
          ...prev,
          isRead: true,
        }));
      }
      if (res.status === 403) {
        console.log("권한 없음");
        setDiaryState((prev) => ({
          ...prev,
          isRedirect: true,
        }));
      }
      if (res.status === 401) {
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reissue`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.accessToken}`,
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
            updateDiary({
              diaryData: diaryData,
              accessToken: data.accessToken,
            });
          });
      }
    });
  }

  async function getDiary(accessToken, diaryUuid) {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries/${diaryUuid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  }

  useLayoutEffect(() => {
    if (originData) {
      setDiaryData({
        ...diaryData,
        title: originData.title,
        content: originData.content,
        date: new Date(originData.date),
        tags: originData.tags,
      });
      titleRef.current && (titleRef.current.value = originData.title);
      contentRef.current && (contentRef.current.value = originData.content);
    }
  }, [originData]);

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
        <Calendar date={new Date(diaryData.date)} setData={setDiaryData} />
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
          {diaryData.tags?.map((tag) => (
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
        <DiaryModalShapeSelectBox
          diaryData={diaryData}
          setDiaryData={setDiaryData}
        />
        <ModalSideButtonWrapper>
          <ModalSideButton onClick={closeModal}>
            <img src={close} alt='delete' />
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
    </>
  );
}

function DiaryModalShapeSelectBox(props) {
  const { diaryData, setDiaryData } = props;
  const shapeState = useRecoilValue(shapeAtom);
  const [shapeList, setShapeList] = useState([]);

  useEffect(() => {
    if (shapeState) {
      const newShapeList = shapeState.map((shape) => ({
        ...shape,
        data:
          shape.uuid === diaryData.shapeUuid
            ? shape.data
            : shape.data.replace(/fill="#fff"/g, 'fill="#999999"'),
      }));

      setShapeList(newShapeList);
    }
  }, [shapeState]);

  useEffect(() => {
    if (diaryData.shapeUuid && shapeList.length > 0) {
      const newShapeList = shapeList.map((shape) => ({
        ...shape,
        data:
          shape.uuid === diaryData.shapeUuid
            ? shape.data.replace(/fill="#999999"/g, 'fill="#fff"')
            : shape.data.replace(/fill="#fff"/g, 'fill="#999999"'),
      }));
      setShapeList(newShapeList);
    }
  }, [diaryData.shapeUuid]);

  return (
    <ShapeSelectBoxWrapper>
      <ShapeSelectTextWrapper>
        <DiaryModalTitle>모양</DiaryModalTitle>
      </ShapeSelectTextWrapper>
      <ShapeSelectItemWrapper>
        {shapeList?.map((shape) => (
          <ShapeSelectBoxItem
            key={shape.uuid}
            onClick={() => {
              setDiaryData((prev) => ({ ...prev, shapeUuid: shape.uuid }));
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: shape.data }}
              style={{ width: "3rem", height: "3rem" }}
            />
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
  justify-content: space-between;
  align-items: center;
  overflow: auto;
  overflow-y: hidden;
  margin-bottom: 1rem;
  gap: 1rem;
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

const DiaryModalTitle = styled.h1`
  font-size: 1.5rem;
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
  background-color: rgba(255, 255, 255, 0.2);

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export default DiaryUpdateModal;
