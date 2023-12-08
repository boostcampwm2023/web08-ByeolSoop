import React, { useState } from "react";
import styled from "styled-components";
import rule from "../../assets/rule.png";

function SignUpRuleGuide() {
  const [isRuleGuideOpen, setIsRuleGuideOpen] = useState(false);
  return (
    <SignUpRuleGuideWrapper>
      <SignUpRuleGuideImg
        src={rule}
        alt='rule'
        onMouseEnter={() => setIsRuleGuideOpen(true)}
        onMouseLeave={() => setIsRuleGuideOpen(false)}
      />
      {isRuleGuideOpen && (
        <SignUpRuleGuideTextWrapper>
          <SignUpRuleGuideText>
            아이디: 5~20자의 영문 대소문자, 숫자와 특수기호(_),(-)
            <br />
            비밀번호: 5~20자의 영문 대소문자, 숫자, 특수문자
            <br />
            <br />
            네이버 / 카카오 계정으로도 간편하게 로그인할 수 있습니다.
          </SignUpRuleGuideText>
        </SignUpRuleGuideTextWrapper>
      )}
    </SignUpRuleGuideWrapper>
  );
}

const SignUpRuleGuideTextWrapper = styled.div`
  width: 80%;
  height: 20%;
  border-radius: 0.5rem;
  background-color: #bbc2d4;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 14%;
  font-size: 1rem;
  text-align: center;
  line-height: 1.8rem;

  animation: fadeIn 0.3s forwards;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SignUpRuleGuideWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignUpRuleGuideImg = styled.img`
  width: 1.8rem;
  filter: invert(100%);
  cursor: pointer;

  animation: blink 1.25s 3;
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SignUpRuleGuideText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

export default SignUpRuleGuide;
