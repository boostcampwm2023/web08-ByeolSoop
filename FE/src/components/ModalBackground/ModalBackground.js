import React from "react";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import headerAtom from "../../atoms/headerAtom";

function ModalBackground(props) {
  const { $opacity, $zindex } = props;
  const setModalState = useSetRecoilState(headerAtom);

  const closeModal = () => {
    setModalState({
      isLogin: false,
      isSignUp: false,
    });
  };

  return (
    <ModalBackgroundWrapper
      onClick={closeModal}
      $opacity={$opacity}
      $zindex={$zindex}
    />
  );
}

const ModalBackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${(props) => props.$zindex || 1000};
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, ${(props) => props.$opacity || 0.5});
`;

export default ModalBackground;
