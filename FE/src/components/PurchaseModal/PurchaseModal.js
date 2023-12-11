import React, { useState } from "react";
import styled from "styled-components";
import leftIcon from "../../assets/leftIcon.svg";
import rightIcon from "../../assets/rightIcon.svg";
import oneStar from "../../assets/onestar.svg";
import twoStar from "../../assets/twostar.svg";
import threeStar from "../../assets/threestar.svg";
import fourStar from "../../assets/fourstar.svg";

function PurchaseModal() {
  const [x, setX] = useState(0);

  return (
    <PurchaseModalWrapper x={x}>
      <PurchaseModalContainer>
        <PurchaseModalContainerTitle $left='25%'>
          구매하기
        </PurchaseModalContainerTitle>
        <PurchaseModalContentWrapper>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <PurchaseModalText>땅 스킨 구매</PurchaseModalText>
            <PurchaseModalText $size='1rem'>100 별가루</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <PurchaseModalText>모양 슬롯 확장</PurchaseModalText>
            <PurchaseModalText $size='1rem'>100 별가루</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <PurchaseModalText>광고 제거</PurchaseModalText>
            <PurchaseModalText $size='1rem'>350 별가루</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <PurchaseModalText>별숲 후원</PurchaseModalText>
            <PurchaseModalText $size='1rem'>30000 별가루</PurchaseModalText>
          </PurchaseModalContent>
        </PurchaseModalContentWrapper>
      </PurchaseModalContainer>
      <PurchaseModalContainer>
        <PurchaseModalContainerTitle $left='75%'>
          환전하기
        </PurchaseModalContainerTitle>
        <ExchangeModalContentWrapper>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <StarIcon src={oneStar} alt='oneStar' width='5rem' />
            <ContentTextWrapper>
              <PurchaseModalText>별가루</PurchaseModalText>
              <PurchaseModalText $size='1.2rem'>100</PurchaseModalText>
            </ContentTextWrapper>
            <PurchaseModalText>₩ 1000</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <StarIcon src={twoStar} alt='twoStar' width='4.5rem' />
            <ContentTextWrapper>
              <PurchaseModalText>별가루</PurchaseModalText>
              <PurchaseModalText $size='1.2rem'>300</PurchaseModalText>
              <PurchaseModalText $size='0.8rem'>+ 120</PurchaseModalText>
            </ContentTextWrapper>
            <PurchaseModalText>₩ 5000</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <StarIcon src={threeStar} alt='threeStar' width='4rem' />
            <ContentTextWrapper>
              <PurchaseModalText>별가루</PurchaseModalText>
              <PurchaseModalText $size='1.2rem'>1000</PurchaseModalText>
              <PurchaseModalText $size='0.8rem'>+ 300</PurchaseModalText>
            </ContentTextWrapper>
            <PurchaseModalText>₩ 10000</PurchaseModalText>
          </PurchaseModalContent>
          <PurchaseModalContent
            onClick={() => {
              alert("준비 중인 서비스입니다.");
            }}
          >
            <StarIcon src={fourStar} alt='fourStar' width='10rem' />
            <ContentTextWrapper>
              <PurchaseModalText>별가루</PurchaseModalText>
              <PurchaseModalText $size='1.2rem'>2000</PurchaseModalText>
              <PurchaseModalText $size='0.8rem'>+ 1000</PurchaseModalText>
            </ContentTextWrapper>
            <PurchaseModalText>₩ 20000</PurchaseModalText>
          </PurchaseModalContent>
        </ExchangeModalContentWrapper>
      </PurchaseModalContainer>
      <ArrowIcon
        src={rightIcon}
        alt='rightIcon'
        $left='47%'
        onClick={() => {
          setX(-50);
        }}
      />
      <ArrowIcon
        src={leftIcon}
        alt='leftIcon'
        $left='53%'
        onClick={() => {
          setX(0);
        }}
      />
    </PurchaseModalWrapper>
  );
}

const PurchaseModalWrapper = styled.div`
  z-index: 1000;

  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: 0.5s;
  transform: translateX(${(props) => props.x}%);
`;

const PurchaseModalContainer = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PurchaseModalContainerTitle = styled.div`
  position: fixed;
  top: 10%;
  left: ${(props) => props.$left};
  transform: translateX(-50%);

  font-size: 1.8rem;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 1rem;
`;

const PurchaseModalText = styled.div`
  font-size: ${(props) => props.$size || "1.5rem"};
  font-weight: ${(props) => props.$bold || "normal"};
  color: #ffffff;
  text-align: center;
  line-height: 1.5;
`;

const PurchaseModalContentWrapper = styled.div`
  width: 60%;
  height: 55%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 1rem;

  justify-items: center;
  align-items: center;
`;

const ExchangeModalContentWrapper = styled.div`
  width: 70%;
  height: 60%;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-gap: 1rem;

  justify-items: center;
  align-items: center;
`;

const PurchaseModalContent = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10%;

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

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const ContentTextWrapper = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const ArrowIcon = styled.img`
  width: 3rem;
  height: 3rem;

  position: fixed;
  top: 50%;
  left: ${(props) => props.$left || "0"};
  transform: translate(-50%, -50%);

  filter: invert(1);
  cursor: pointer;
`;

const StarIcon = styled.img`
  width: ${(props) => props.width};
  height: 10rem;
`;

export default PurchaseModal;
