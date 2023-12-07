import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import diaryAtom from "../../atoms/diaryAtom";
import shapeAtom from "../../atoms/shapeAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import Calendar from "./Calendar";
import close from "../../assets/close.svg";
import { preventBeforeUnload, getFormattedDate } from "../../utils/utils";
import ModalBackground from "../ModalBackground/ModalBackground";

function DiaryCreateModal(props) {
  const { refetch } = props;
  const [isInput, setIsInput] = useState(false);
  const diaryState = useRecoilValue(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const setDiaryState = useSetRecoilState(diaryAtom);

  // TODO: 날짜 선택 기능 구현
  const [diaryData, setDiaryData] = useState({
    title: "",
    content: "",
    date: new Date(),
    point: diaryState.diaryPoint,
    tags: [],
    shapeUuid: "",
  });

  useEffect(() => {
    window.addEventListener("beforeunload", preventBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", preventBeforeUnload);
    };
  }, []);

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

  async function createDiaryFn(data) {
    const diaryData = {
      title: data.diaryData.title,
      content: data.diaryData.content,
      date: getFormattedDate(data.diaryData.date),
      point: data.diaryData.point,
      tags: data.diaryData.tags,
      shapeUuid: data.diaryData.shapeUuid,
    };

    return fetch(`${process.env.REACT_APP_BACKEND_URL}/diaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify(diaryData),
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        }
        if (res.status === 403) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("nickname");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("nickname");
          window.location.href = "/";
        }
        throw new Error("error");
      })
      .then(() => {
        refetch();
        setDiaryState((prev) => ({
          ...prev,
          isLoading: true,
        }));
      });
  }

  const {
    mutate: createDiary,
    // isLoading: diaryIsLoading,
    // isError: diaryIsError,
  } = useMutation(createDiaryFn);

  return (
    <>
      <ModalBackground $opacity='0' />
      <ModalWrapper $left='50%' width='40vw' height='65vh'>
        <Calendar date={diaryData.date} setData={setDiaryData} />
        <DiaryModalInputBox
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
        <DiaryModalShapeSelectBox
          diaryData={diaryData}
          setDiaryData={setDiaryData}
        />
        <ModalSideButtonWrapper>
          <ModalSideButton
            onClick={() => {
              setDiaryState((prev) => ({ ...prev, isCreate: false }));
            }}
          >
            <img src={close} alt='delete' />
          </ModalSideButton>
          {isInput ? (
            <ModalSideButton
              width='5rem'
              onClick={() => {
                createDiary({ diaryData, accessToken: userState.accessToken });
                setDiaryState((prev) => ({ ...prev, isCreate: false }));
              }}
            >
              생성
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
        data: shape.data.replace(/fill="#fff"/g, 'fill="#999999"'),
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
        <ShapeSelectText>직접 그리기</ShapeSelectText>
      </ShapeSelectTextWrapper>
      <ShapeSelectItemWrapper>
        {shapeList?.map((shape) => (
          <ShapeSelectBoxItem
            key={shape.uuid}
            onClick={() => {
              setDiaryData((prev) => ({ ...prev, shapeUuid: shape.uuid }));
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: shape.data }} />
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

export default DiaryCreateModal;
