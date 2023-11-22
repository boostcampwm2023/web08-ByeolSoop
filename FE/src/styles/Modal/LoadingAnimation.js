import styled, { keyframes } from "styled-components";

const LoadingAnimation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    50% {
        transform: rotate(180deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const LoadingAnimationWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${LoadingAnimation} 1.5s linear infinite;
`;

const LoadingAnimationIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 0.25rem solid #ffffff;
  border-top: 0.25rem solid rgba(255, 255, 255, 0.3);
`;

export { LoadingAnimationWrapper, LoadingAnimationIcon };
