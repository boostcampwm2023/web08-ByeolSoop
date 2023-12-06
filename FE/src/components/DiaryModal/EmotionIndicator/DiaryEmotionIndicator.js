import React, { useState } from "react";
import styled from "styled-components";
import EmotionPicket from "./EmotionPicket";
import indicatorArrowIcon from "../../../assets/indicator-arrow.svg";

function DiaryEmotionIndicator({ emotion, width, text }) {
  const [isHover, setIsHover] = useState("");
  return (
    <EmotionIndicatorWrapper>
      <EmotionIndicatorBar width={width}>
        <EmotionIndicator
          ratio={`${emotion.positive}%`}
          color='#618CF7'
          onMouseEnter={() => setIsHover("positive")}
          onMouseLeave={() => setIsHover("")}
        >
          {isHover === "positive" ? (
            <EmotionPicket percent={emotion.positive} />
          ) : null}
        </EmotionIndicator>
        <EmotionIndicatorArrow>
          <img
            src={indicatorArrowIcon}
            alt='arrow'
            style={{ width: "1rem", height: "1rem" }}
          />
        </EmotionIndicatorArrow>
        <EmotionIndicator
          ratio={`${emotion.neutral}%`}
          color='#A848F6'
          onMouseEnter={() => setIsHover("neutral")}
          onMouseLeave={() => setIsHover("")}
        >
          {isHover === "neutral" ? (
            <EmotionPicket percent={emotion.neutral} />
          ) : null}
        </EmotionIndicator>
        <EmotionIndicatorArrow>
          <img
            src={indicatorArrowIcon}
            alt='arrow'
            style={{ width: "1rem", height: "1rem" }}
          />
        </EmotionIndicatorArrow>
        <EmotionIndicator
          ratio={`${emotion.negative}%`}
          color='#E5575B'
          onMouseEnter={() => setIsHover("negative")}
          onMouseLeave={() => setIsHover("")}
        >
          {isHover === "negative" ? (
            <EmotionPicket percent={emotion.negative} />
          ) : null}
        </EmotionIndicator>
      </EmotionIndicatorBar>
      {text === true ? (
        <EmotionTextWrapper>
          <EmotionText>긍정 {emotion.positive.toFixed(1)}%</EmotionText>
          <EmotionText>중립 {emotion.neutral.toFixed(1)}%</EmotionText>
          <EmotionText>부정 {emotion.negative.toFixed(1)}%</EmotionText>
        </EmotionTextWrapper>
      ) : null}
    </EmotionIndicatorWrapper>
  );
}

const EmotionIndicatorWrapper = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const EmotionIndicatorBar = styled.div`
  width: ${(props) => props.width || "20rem"};
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EmotionIndicator = styled.div`
  width: ${(props) => props.ratio};
  height: 100%;
  background-color: ${(props) => props.color};
  display: flex;
  justify-content: center;
`;

const EmotionIndicatorArrow = styled.div`
  display: flex;
  justify-content: center;
  width: 0;
  height: 4rem;
`;

const EmotionTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmotionText = styled.div`
  font-size: 0.9rem;
`;

export default DiaryEmotionIndicator;
