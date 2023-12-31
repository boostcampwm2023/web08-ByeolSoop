import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import leftIcon from "../../assets/leftIcon.svg";
import rightIcon from "../../assets/rightIcon.svg";
import oneStar from "../../assets/onestar.svg";
import twoStar from "../../assets/twostar.svg";
import threeStar from "../../assets/threestar.svg";
import fourStar from "../../assets/fourstar.svg";
import diaryAtom from "../../atoms/diaryAtom";
import handleResponse from "../../utils/handleResponse";

function PurchaseButtonComponent(props) {
  const {
    onClick = () => {
      alert("준비 중인 서비스입니다.");
    },
    text,
    price,
  } = props;

  return (
    <PurchaseModalContent onClick={onClick}>
      <PurchaseModalText>{text}</PurchaseModalText>
      <PurchaseModalText $size='1rem'>{price} 별가루</PurchaseModalText>
    </PurchaseModalContent>
  );
}

function ExchangeButtonComponent(props) {
  const {
    onClick = () => {
      alert("준비 중인 서비스입니다.");
    },
    icon,
    width,
    star,
    bonus,
    price,
  } = props;

  return (
    <PurchaseModalContent onClick={onClick}>
      <StarIcon src={icon} alt='star' width={width} />
      <ContentTextWrapper>
        <PurchaseModalText>별가루</PurchaseModalText>
        <PurchaseModalText $size='1.2rem'>{star}</PurchaseModalText>
        {bonus && (
          <PurchaseModalText $size='0.8rem'>+ {bonus}</PurchaseModalText>
        )}
      </ContentTextWrapper>
      <PurchaseModalText>₩ {price}</PurchaseModalText>
    </PurchaseModalContent>
  );
}

function PurchaseModal(props) {
  const { premiumRefetch } = props;
  const [userState, setUserState] = useRecoilState(userAtom);
  const setDiaryState = useSetRecoilState(diaryAtom);
  const [x, setX] = useState(0);

  const { data: creditData, refetch: creditRefetch } = useQuery(
    ["credit", userState.accessToken],
    async () =>
      fetch(`${process.env.REACT_APP_BACKEND_URL}/purchase/credit`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      }).then((res) =>
        handleResponse(res, userState.accessToken, {
          successStatus: 200,
          onSuccessCallback: () => res.json(),
          on403Callback: () => {
            setDiaryState((prev) => ({
              ...prev,
              isRedirect: true,
            }));
          },
          on401Callback: (accessToken) => {
            setUserState((prev) => ({
              ...prev,
              accessToken,
            }));
          },
        }),
      ),
  );

  const exchangeButtons = [
    { icon: oneStar, width: "5rem", star: "100", price: "1000" },
    {
      icon: twoStar,
      width: "4.5rem",
      star: "300",
      bonus: "120",
      price: "5000",
    },
    {
      icon: threeStar,
      width: "4rem",
      star: "1000",
      bonus: "500",
      price: "10000",
    },
    {
      icon: fourStar,
      width: "10rem",
      star: "2000",
      bonus: "1000",
      price: "20000",
    },
  ];

  const { mutate: purchase } = useMutation((data) => {
    if (data.credit > creditData.credit) {
      alert("별가루가 부족합니다.");
    } else {
      const fetchData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      };

      if (data.item === "design") {
        // TODO: 디자인 구매 API
        // fetchData.body 추가
      }

      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/purchase/${data.item}`,
        fetchData,
      ).then((res) =>
        handleResponse(res, userState.accessToken, {
          successStatus: 201,
          onSuccessCallback: () => {
            alert("구매가 완료되었습니다.");
            creditRefetch();
            premiumRefetch();
          },
          on400Callback: async () => {
            alert((await res.json()).message);
          },
          on401Callback: (accessToken) => {
            setUserState((prev) => ({
              ...prev,
              accessToken,
            }));
            purchase({
              credit: data.credit,
              item: data.item,
              accessToken,
            });
          },
        }),
      );
    }
  });

  return (
    <PurchaseModalWrapper x={x}>
      <PurchaseModalContainer>
        <PurchaseModalContainerTitle $left='25%'>
          구매하기
        </PurchaseModalContainerTitle>
        <PurchaseModalCreditWrapper $left='35%'>
          <StarIcon src={oneStar} alt='star' width='1.2rem' height='1.2rem' />
          <PurchaseModalText>
            {creditData ? creditData.credit : 0}
          </PurchaseModalText>
        </PurchaseModalCreditWrapper>
        <PurchaseModalContentWrapper>
          <PurchaseButtonComponent text='땅 스킨 구매' price='100' />
          <PurchaseButtonComponent text='모양 슬롯 확장' price='100' />
          <PurchaseButtonComponent
            text='광고 제거'
            price='350'
            onClick={() => {
              purchase({
                credit: 350,
                item: "premium",
                accessToken: userState.accessToken,
              });
            }}
          />
          <PurchaseButtonComponent text='별숲 후원' price='30000' />
        </PurchaseModalContentWrapper>
      </PurchaseModalContainer>
      <PurchaseModalContainer>
        <PurchaseModalContainerTitle $left='75%'>
          환전하기
        </PurchaseModalContainerTitle>
        <PurchaseModalCreditWrapper $left='85%'>
          <StarIcon src={oneStar} alt='star' width='1.2rem' height='1.2rem' />
          <PurchaseModalText>
            {creditData ? creditData.credit : 0}
          </PurchaseModalText>
        </PurchaseModalCreditWrapper>
        <ExchangeModalContentWrapper>
          {exchangeButtons.map((button, index) => (
            <ExchangeButtonComponent
              key={`${index + 1}`}
              icon={button.icon}
              width={button.width}
              star={button.star}
              bonus={button.bonus}
              price={button.price}
              onclick={button.onClick}
            />
          ))}
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
  backdrop-filter: blur(3.5px);

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
  height: ${(props) => props.height || "10rem"};
`;

const PurchaseModalCreditWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  position: fixed;
  top: 10%;
  left: ${(props) => props.$left};

  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
`;

export default PurchaseModal;
