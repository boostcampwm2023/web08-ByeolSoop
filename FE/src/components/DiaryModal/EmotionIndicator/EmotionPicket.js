import React from "react";
import styled from "styled-components";
import picket from "../../../assets/picket.svg";

function EmotionPicket(props) {
  const { percent } = props;

  return (
    <EmotionPicketWrapper>
      <Picket>{percent.toFixed(1)}%</Picket>
    </EmotionPicketWrapper>
  );
}

const EmotionPicketWrapper = styled.div`
  width: 5rem;
  height: 3.3rem;
  position: float;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1rem;
  color: #ffffff;
`;

const Picket = styled.div`
  width: 100%;
  height: 3rem;
  background-image: url(${picket});
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  line-height: 2.3rem;
`;

export default EmotionPicket;
