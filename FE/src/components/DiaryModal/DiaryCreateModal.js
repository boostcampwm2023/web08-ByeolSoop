import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import diaryAtom from "../../atoms/diaryAtom";
import shapeAtom from "../../atoms/shapeAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import DiaryModalHeader from "../../styles/Modal/DiaryModalHeader";
import deleteIcon from "../../assets/deleteIcon.svg";
import preventBeforeUnload from "../../utils/utils";

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
    date: "2023-11-19",
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
    return fetch("http://localhost:3005/diaries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
      body: JSON.stringify(data.diaryData),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        if (res.status === 403) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("accessToken");
          sessionStorage.removeItem("accessToken");
          window.location.href = "/";
        }
        return {};
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
    <ModalWrapper left='50%' width='40vw' height='65vh' opacity='0.3'>
      <DiaryModalHeader>
        <DiaryModalTitle>새로운 별의 이야기를 적어주세요.</DiaryModalTitle>
        <DiaryModalDate>{diaryData.date}</DiaryModalDate>
      </DiaryModalHeader>
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
      <DiaryModalShapeSelectBox setDiaryData={setDiaryData} />
      <ModalSideButtonWrapper>
        <ModalSideButton
          onClick={() => {
            setDiaryState((prev) => ({ ...prev, isCreate: false }));
          }}
        >
          <img src={deleteIcon} alt='delete' />
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
  );
}

function DiaryModalShapeSelectBox(props) {
  const { setDiaryData } = props;
  const shapeState = useRecoilValue(shapeAtom);

  return (
    <ShapeSelectBoxWrapper>
      <ShapeSelectTextWrapper>
        <DiaryModalTitle>모양</DiaryModalTitle>
        <ShapeSelectText>직접 그리기</ShapeSelectText>
      </ShapeSelectTextWrapper>
      <ShapeSelectItemWrapper>
        {shapeState?.map((shape) => (
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

export default DiaryCreateModal;
