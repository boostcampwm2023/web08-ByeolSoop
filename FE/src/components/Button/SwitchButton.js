import React, { useState } from "react";
import styled from "styled-components";

function SwitchButton(props) {
  const { bottom, right } = props;
  const { leftContent, rightContent, leftEvent, rightEvent } = props;
  const [current, setCurrent] = useState(leftContent);

  return (
    <SwitchButtonWrapper $bottom={bottom} $right={right}>
      <SwitchButtonContent
        selected={current === leftContent}
        onClick={() => {
          setCurrent(leftContent);
          leftEvent();
        }}
      >
        {leftContent}
      </SwitchButtonContent>
      <SwitchButtonContent
        selected={current === rightContent}
        onClick={() => {
          setCurrent(rightContent);
          rightEvent();
        }}
      >
        {rightContent}
      </SwitchButtonContent>
    </SwitchButtonWrapper>
  );
}

const SwitchButtonWrapper = styled.div`
  width: 200px;
  height: 30px;
  border-radius: 15px;

  position: absolute;
  bottom: ${(props) => props.$bottom};
  right: ${(props) => props.$right};

  display: flex;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;

  cursor: pointer;

  animation: modalFadeIn 0.5s;
  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SwitchButtonContent = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${(props) =>
    props.selected ? "#ffffff" : "rgba(255, 255, 255, 0.5)"};
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: left 0.5s ease-in-out;
`;

export default SwitchButton;
