import React from "react";
import styled from "styled-components";

function DiaryPicket({ $top, $left, text }) {
  return (
    <DiaryPicketWrapper $top={$top} $left={$left}>
      {text}
      <DiaryPicketArrow />
    </DiaryPicketWrapper>
  );
}

const DiaryPicketWrapper = styled.div`
  padding: 0.5rem;
  background-color: #3b455e;
  border-radius: 0.5rem;

  position: absolute;
  top: ${(props) => props.$top || 50}px;
  left: ${(props) => props.$left || 50}px;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1rem;
  color: white;
  cursor: pointer;
  white-space: nowrap;
`;

const DiaryPicketArrow = styled.div`
  width: 0;
  height: 0;
  border-left: 0.5rem solid transparent;
  border-right: 0.5rem solid transparent;
  border-top: 0.5rem solid #3b455e;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default DiaryPicket;
