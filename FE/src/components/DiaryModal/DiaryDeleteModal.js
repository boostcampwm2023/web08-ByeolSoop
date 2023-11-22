import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";

function DiaryDeleteModal() {
  const setDiaryState = useSetRecoilState(diaryAtom);

  return (
    <DeleteModalWrapper left='50%' width='15vw' height='10vh' opacity='0'>
      <DeleteModalTitle>삭제하시겠습니까?</DeleteModalTitle>
      <DeleteModalButtonWrapper>
        <DeleteModalButton
          onClick={() => {
            setDiaryState((prev) => ({
              ...prev,
              isDelete: false,
            }));
          }}
        >
          취소
        </DeleteModalButton>
        <DeleteModalButton
          onClick={() => {
            setDiaryState((prev) => ({
              ...prev,
              isRead: false,
              isDelete: false,
            }));
          }}
        >
          확인
        </DeleteModalButton>
      </DeleteModalButtonWrapper>
    </DeleteModalWrapper>
  );
}

const DeleteModalWrapper = styled(ModalWrapper)`
  background-color: #bbc2d4;
  color: #000000;
`;

const DeleteModalTitle = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  align-self: center;
`;

const DeleteModalButtonWrapper = styled.div`
  width: 200%;
  position: relative;
  top: 10%;
  left: -50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const DeleteModalButton = styled.button`
  width: 30%;
  height: 3rem;
  border: none;
  border-radius: 0.5rem;
  font-family: "Pretendard-Medium";
  font-size: 1.2rem;
  cursor: pointer;
`;

export default DiaryDeleteModal;
