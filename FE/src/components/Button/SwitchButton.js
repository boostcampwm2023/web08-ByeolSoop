import React, { useState } from "react";
import styled from "styled-components";

function SwitchButton(props) {
  // 위치 설정 관련 props
  const { bottom, right } = props;
  // 버튼 내용 / 이벤트 관련 props
  const { leftContent, rightContent, leftEvent, rightEvent } = props;
  const [current, setCurrent] = useState(leftContent);

  return (
    <SwitchButtonWrapper bottom={bottom} right={right}>
      <SwitchButtonContent
        isOn={current === leftContent}
        onClick={() => {
          setCurrent(leftContent);
          leftEvent();
        }}
      >
        {leftContent}
      </SwitchButtonContent>
      <SwitchButtonContent
        isOn={current === rightContent}
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
  bottom: ${(props) => props.bottom};
  right: ${(props) => props.right};

  display: flex;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;

  cursor: pointer;
`;

const SwitchButtonContent = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${(props) => (props.isOn ? "#ffffff" : "#ffffff80")};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: left 0.5s ease-in-out;
`;

export default SwitchButton;
