import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";
import DiaryModalHeader from "../../styles/Modal/DiaryModalHeader";
import stars from "../../assets/stars";
import deleteIcon from "../../assets/deleteIcon.svg";

function pushTag(tagList, tag) {
  if (tagList.includes(tag)) {
    return tagList;
  }
  return [...tagList, tag];
}

function DiaryCreateModal() {
  const [isInput, setIsInput] = React.useState(false);
  const [tagList, setTagList] = React.useState([]);
  const setDiaryState = useSetRecoilState(diaryAtom);

  const addTag = (e) => {
    if (e.target.value.length > 0) {
      setTagList(pushTag(tagList, e.target.value));
      e.target.value = "";
    }
  };

  const deleteTag = () => {
    setTagList(tagList.slice(0, tagList.length - 1));
  };

  return (
    <ModalWrapper left='60%' width='40vw' height='65vh' opacity='0.3'>
      <DiaryModalHeader>
        <DiaryModalTitle>새로운 별의 이야기를 적어주세요.</DiaryModalTitle>
        <DiaryModalDate>
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </DiaryModalDate>
      </DiaryModalHeader>
      <DiaryModalInputBox
        fontSize='1.1rem'
        placeholder='제목을 입력해주세요.'
        onChange={(e) => {
          if (e.target.value.length > 0) {
            setIsInput(true);
          } else {
            setIsInput(false);
          }
        }}
      />
      <DiaryModalContentInputBox placeholder='내용을 입력해주세요.' />
      <DiaryModalTagWrapper>
        {tagList.map((tag) => (
          <DiaryModalTagBox
            onClick={() => {
              setTagList(tagList.filter((item) => item !== tag));
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
              deleteTag();
            }
          }}
        />
      </DiaryModalTagWrapper>

      <DiaryModalShapeSelectBox />
      <ModalSideButtonWrapper>
        <ModalSideButton
          onClick={() => {
            setDiaryState({
              isCreate: false,
              isRead: false,
              isDelete: false,
            });
          }}
        >
          <img src={deleteIcon} alt='delete' />
        </ModalSideButton>
        {isInput ? (
          <ModalSideButton width='5rem' borderRadius='2rem'>
            생성
          </ModalSideButton>
        ) : null}
      </ModalSideButtonWrapper>
    </ModalWrapper>
  );
}

function DiaryModalShapeSelectBox() {
  return (
    <ShapeSelectBoxWrapper>
      <ShapeSelectTextWrapper>
        <DiaryModalTitle>모양</DiaryModalTitle>
        <ShapeSelectText>직접 그리기</ShapeSelectText>
      </ShapeSelectTextWrapper>
      <ShapeSelectItemWrapper>
        {stars.map((star) => (
          <ShapeSelectBoxItem>{star}</ShapeSelectBoxItem>
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

  &::-webkit-scrollbar {
    display: none;
  }
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
  border-radius: ${(props) => props.borderRadius || "100%"};
  z-index: 1001;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
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
  line-height: 1.5rem;

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

  &::-webkit-scrollbar {
    display: none;
  }
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
