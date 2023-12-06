import React from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import diaryAtom from "../../atoms/diaryAtom";
import userAtom from "../../atoms/userAtom";
import ModalWrapper from "../../styles/Modal/ModalWrapper";

function DiaryDeleteModal(props) {
  const { refetch } = props;
  const diaryState = useRecoilValue(diaryAtom);
  const userState = useRecoilValue(userAtom);
  const setDiaryState = useSetRecoilState(diaryAtom);

  async function deleteDiaryFn(data) {
    return fetch(`http://223.130.129.145:3005/diaries/${data.diaryUuid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.accessToken}`,
      },
    })
      .then((res) => {
        if (res.status === 204) {
          return res;
        }
        if (res.status === 403) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("nickname");
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("nickname");
          window.location.href = "/";
        }
        return null;
      })
      .then(() => {
        refetch();
      });
  }

  const {
    mutate: deleteDiary,
    // isLoading,
    // error,
  } = useMutation(deleteDiaryFn);

  return (
    <DeleteModalWrapper $left='50%' width='15vw' height='10vh' opacity='0'>
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
          color='rgba(255, 0, 0, 0.8)'
          onClick={() => {
            deleteDiary({
              diaryUuid: diaryState.diaryUuid,
              accessToken: userState.accessToken,
            });
            window.history.back();
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
  color: ${(props) => props.color || "#000000"};
`;

export default DiaryDeleteModal;
