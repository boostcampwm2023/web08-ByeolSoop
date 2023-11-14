import React from "react";
import styled from "styled-components";

function ModalBackground() {
  return <ModalBackgroundWrapper />;
}

const ModalBackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default ModalBackground;
