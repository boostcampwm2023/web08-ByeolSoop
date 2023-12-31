import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import dayjs from "dayjs";
import userAtom from "../../atoms/userAtom";
import shapeAtom from "../../atoms/shapeAtom";
import diaryAtom from "../../atoms/diaryAtom";
import DiaryEmotionIndicator from "./EmotionIndicator/DiaryEmotionIndicator";
import DiaryPicket from "./DiaryPicket";
import Tag from "../../styles/Modal/Tag";
import leftIcon from "../../assets/leftIcon.svg";
import rightIcon from "../../assets/rightIcon.svg";
import logoNoText from "../../assets/logo-notext.svg";
import handleResponse from "../../utils/handleResponse";

function DiaryAnalysisModal() {
  const [userState, setUserState] = useRecoilState(userAtom);
  const setDiaryState = useSetRecoilState(diaryAtom);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentYear, setCurrentYear] = useState(dayjs("2023"));
  const [emotion, setEmotion] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [monthAnalysis, setMonthAnalysis] = useState(Array(12).fill(0));
  const [hoverData, setHoverData] = useState({
    top: 0,
    left: 0,
    text: "",
  });
  const emotions = [
    { bg: "#618cf7", text: "긍정" },
    { bg: "#e5575b", text: "부정" },
    { bg: "#a848f6", text: "중립" },
  ];

  async function getDataFn(data) {
    return fetch(
      `${process.env.REACT_APP_BACKEND_URL}/stat/${data}/${currentYear.year()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userState.accessToken}`,
        },
      },
    ).then((res) =>
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
    );
  }

  const { data: tagsRankData, refetch: tagsRankRefetch } = useQuery(
    ["tagsRank", userState.accessToken],
    async () => {
      const result = await getDataFn("tags-rank");
      return result;
    },
  );

  const { data: shapesRankData, refetch: shapesRankRefetch } = useQuery(
    ["shapesRank", userState.accessToken],
    async () => {
      const result = await getDataFn("shapes-rank");
      return result;
    },
    {
      onSuccess: () => {
        tagsRankRefetch();
      },
    },
  );

  const { data: diaryAnalysisData, refetch: diaryAnalysisRefetch } = useQuery(
    ["diaryAnalysis", userState.accessToken],
    async () => {
      const result = await getDataFn("diaries");
      return result;
    },
    {
      onSuccess: (data) => {
        const newEmotion = {
          positive: 0,
          negative: 0,
          neutral: 0,
        };
        const newMonthAnalysis = Array(12).fill(0);
        Object.keys(data).forEach((date) => {
          const { sentiment, count } = data[date];
          newEmotion[sentiment] += 1;
          newMonthAnalysis[dayjs(date).month()] += count;
        });

        if (
          Object.values(newEmotion).reduce((acc, cur) => acc + cur, 0) === 0
        ) {
          setEmotion({
            positive: 0,
            negative: 0,
            neutral: 0,
          });
        } else {
          setEmotion({
            positive:
              (newEmotion.positive * 100) /
              Object.values(newEmotion).reduce((acc, cur) => acc + cur, 0),
            negative:
              (newEmotion.negative * 100) /
              Object.values(newEmotion).reduce((acc, cur) => acc + cur, 0),
            neutral:
              (newEmotion.neutral * 100) /
              Object.values(newEmotion).reduce((acc, cur) => acc + cur, 0),
          });
        }
        setMonthAnalysis(newMonthAnalysis);
        shapesRankRefetch();
      },
    },
  );

  useEffect(() => {
    diaryAnalysisRefetch();
  }, [currentYear]);

  return (
    <DiaryAnalysisModalWrapper>
      <DiaryAnalysisModalItem width='80%' height='53%'>
        <DiaryAnalysisModalTitleWrapper width='90%'>
          <DiaryAnalysisModalText>
            {currentYear.year()}년의 감정
          </DiaryAnalysisModalText>
          <ArrowButtonWrapper>
            <ArrowButton
              src={leftIcon}
              alt='left'
              filter={buttonDisabled ? "invert(0.5) grayscale(1)" : "invert(1)"}
              onClick={() => {
                if (!buttonDisabled) {
                  setButtonDisabled(true);
                  setCurrentYear(currentYear.subtract(1, "y"));

                  setTimeout(() => {
                    setButtonDisabled(false);
                  }, 500);
                }
              }}
            />
            <ArrowButton
              src={rightIcon}
              alt='right'
              filter={buttonDisabled ? "invert(0.5) grayscale(1)" : "invert(1)"}
              onClick={() => {
                if (!buttonDisabled) {
                  setButtonDisabled(true);
                  setCurrentYear(currentYear.add(1, "y"));

                  setTimeout(() => {
                    setButtonDisabled(false);
                  }, 500);
                }
              }}
            />
          </ArrowButtonWrapper>
        </DiaryAnalysisModalTitleWrapper>
        {diaryAnalysisData && (
          <StreakBar>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <DailyStreak key={`streak-${day}`} $bg='none'>
                <DailyStreakDay>{day}</DailyStreakDay>
              </DailyStreak>
            ))}
            {Array.from({ length: currentYear.day() }, (v, i) => i + 1).map(
              (day) => (
                <DailyStreak key={`not-current-year-${day}`} $bg='none' />
              ),
            )}
            {Array.from(
              {
                length:
                  1 - currentYear.diff(dayjs(currentYear).endOf("year"), "day"),
              },
              (v, i) => i,
            ).map((day) => {
              let color = "#bbbbbb";
              const date = currentYear.add(day, "d").format("YYYY-MM-DD");
              if (date in diaryAnalysisData) {
                const { sentiment } = diaryAnalysisData[date];
                if (sentiment === "positive") {
                  color = "#618cf7";
                } else if (sentiment === "negative") {
                  color = "#e5575b";
                } else if (sentiment === "neutral") {
                  color = "#a848f6";
                }
              }

              return (
                <DailyStreak
                  key={`current-year-${date}`}
                  $bg={color}
                  onMouseEnter={(e) => {
                    setHoverData({
                      top: e.target.offsetTop - e.target.offsetHeight - 5,
                      left: e.target.offsetLeft + e.target.offsetWidth / 2,
                      text: `${currentYear.add(day, "d").format("MM-DD")} ${
                        diaryAnalysisData[date]?.count || 0
                      }개`,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(null);
                  }}
                />
              );
            })}
          </StreakBar>
        )}
        {hoverData && (
          <DiaryPicket
            $top={hoverData.top}
            $left={hoverData.left}
            text={hoverData.text}
          />
        )}

        <EmotionBar>
          <EmotionBarTextWrapper>
            <DiaryAnalysisModalText size='1.3rem'>
              올해의 감정 상태
            </DiaryAnalysisModalText>
            <DiaryAnalysisModalText size='1rem' color='#ffffff99'>
              마우스를 올려 수치를 확인해보세요.
            </DiaryAnalysisModalText>
          </EmotionBarTextWrapper>
          <EmotionBarContentWrapper>
            <DiaryEmotionIndicator
              emotion={emotion}
              width='50rem'
              text={false}
            />
            <EmotionStreakBar>
              {emotions.map((emotion, index) => (
                <EmotionStreak key={`emotion-${index + 1}`}>
                  <DailyStreak
                    $bg={emotion.bg}
                    $paddingBottom='0'
                    $width='1.2rem'
                    $height='1.2rem'
                  />
                  <DiaryAnalysisModalText size='1rem'>
                    {emotion.text}
                  </DiaryAnalysisModalText>
                </EmotionStreak>
              ))}
            </EmotionStreakBar>
          </EmotionBarContentWrapper>
        </EmotionBar>
      </DiaryAnalysisModalItem>
      <DiaryAnalysisModalSubItemWrapper>
        <DiaryAnalysisModalItem height='100%'>
          {diaryAnalysisData && Object.keys(diaryAnalysisData).length > 0 ? (
            <>
              <DiaryAnalysisModalTitleWrapper>
                <DiaryAnalysisModalText size='1.2rem'>
                  월별 통계
                </DiaryAnalysisModalText>
                <DiaryAnalysisModalText size='1rem'>
                  총 일기 수{" "}
                  {diaryAnalysisData
                    ? Object.values(diaryAnalysisData).reduce(
                        (acc, cur) => acc + cur.count,
                        0,
                      )
                    : 0}
                  개
                </DiaryAnalysisModalText>
              </DiaryAnalysisModalTitleWrapper>
              <MonthGraphBar>
                {monthAnalysis.map((month, index) => (
                  <MonthGraphWrapper
                    key={`
              wrapper-${index + 1}
              `}
                  >
                    <MonthGraph
                      key={`graph-${index + 1}`}
                      height={`${(month / Math.max(...monthAnalysis)) * 100}%`}
                    />
                    <DiaryAnalysisModalText
                      key={`text-${index + 1}`}
                      size='1rem'
                    >
                      {index + 1}
                    </DiaryAnalysisModalText>
                  </MonthGraphWrapper>
                ))}
              </MonthGraphBar>
            </>
          ) : (
            <LogoNoText src={logoNoText} alt='logo' />
          )}
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          {diaryAnalysisData && Object.keys(diaryAnalysisData).length > 0 ? (
            <>
              <DiaryAnalysisModalTitleWrapper>
                <DiaryAnalysisModalText size='1.2rem'>
                  가장 많이 쓴 태그 순위
                </DiaryAnalysisModalText>
              </DiaryAnalysisModalTitleWrapper>
              <DiaryAnalysisModalContentWrapper>
                {tagsRankData &&
                  ["first", "second", "third"].map((rank) =>
                    tagsRankData[rank] ? (
                      <TagRanking
                        key={`${rank}-tag`}
                        rank={tagsRankData[rank].rank}
                        tag={tagsRankData[rank].tag}
                        count={tagsRankData[rank].count}
                      />
                    ) : null,
                  )}
              </DiaryAnalysisModalContentWrapper>
            </>
          ) : (
            <LogoNoText src={logoNoText} alt='logo' />
          )}
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          {diaryAnalysisData && Object.keys(diaryAnalysisData).length > 0 ? (
            <>
              <DiaryAnalysisModalTitleWrapper>
                <DiaryAnalysisModalText size='1.2rem'>
                  가장 많이 쓴 모양 순위
                </DiaryAnalysisModalText>
              </DiaryAnalysisModalTitleWrapper>
              <DiaryAnalysisModalContentWrapper direction='row'>
                {shapesRankData &&
                  ["first", "second", "third"].map((rank) =>
                    shapesRankData[rank] ? (
                      <ShapeRanking
                        key={`${rank}-shape`}
                        rank={shapesRankData[rank].rank}
                        uuid={shapesRankData[rank].uuid}
                        count={shapesRankData[rank].count}
                      />
                    ) : null,
                  )}
              </DiaryAnalysisModalContentWrapper>
            </>
          ) : (
            <LogoNoText src={logoNoText} alt='logo' />
          )}
        </DiaryAnalysisModalItem>
      </DiaryAnalysisModalSubItemWrapper>
    </DiaryAnalysisModalWrapper>
  );
}

function TagRanking(props) {
  const { rank, tag, count } = props;

  return (
    <TagRankingWrapper>
      <TagRankingTextWrapper>
        <DiaryAnalysisModalText size='1.3rem'>{rank}위</DiaryAnalysisModalText>
        <DiaryAnalysisModalText size='1rem' color='#ffffff99'>
          {count}회
        </DiaryAnalysisModalText>
      </TagRankingTextWrapper>
      <Tag>{tag}</Tag>
    </TagRankingWrapper>
  );
}

function ShapeRanking(props) {
  const { rank, uuid, count } = props;
  const shapeState = useRecoilValue(shapeAtom);

  return (
    <ShapeRankingWrapper>
      <ShapeRankingTextWrapper>
        <DiaryAnalysisModalText size='1.3rem'>{rank}위</DiaryAnalysisModalText>
        <DiaryAnalysisModalText size='1rem' color='#ffffff99'>
          {count}회
        </DiaryAnalysisModalText>
      </ShapeRankingTextWrapper>
      <div
        dangerouslySetInnerHTML={{
          __html: shapeState.find((shape) => shape.uuid === uuid)?.data,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </ShapeRankingWrapper>
  );
}

const DiaryAnalysisModalWrapper = styled.div`
  width: 95%;
  height: 97.5%;
  padding: 0 2.5%;
  position: absolute;
  top: 2.5%;
  z-index: 1001;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2%;
`;

const DiaryAnalysisModalItem = styled.div`
  width: ${(props) => props.width || "33%"};
  height: ${(props) => props.height || "85%"};
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  font-size: 1.3rem;
  color: #ffffff;

  overflow: auto;

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

const ArrowButtonWrapper = styled.div`
  width: 5%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ArrowButton = styled.img`
  width: 1rem;
  height: 1rem;
  filter: ${(props) => props.filter || "invert(1)"};
  cursor: pointer;
`;

const StreakBar = styled.div`
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(54, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 0.2rem;
`;

const DailyStreak = styled.div`
  width: ${(props) => props.$width || "100%"};
  padding-bottom: ${(props) => props.$paddingBottom || "100%"};
  height: ${(props) => props.$height || "0"};
  flex-shrink: 0;
  border-radius: 20%;
  background-color: ${(props) => props.$bg || "#bbbbbb"};
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const DailyStreakDay = styled.div`
  position: absolute;
  top: 25%;
`;

const EmotionBar = styled.div`
  width: 85%;
  height: 15%;
  margin: 3rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
`;

const EmotionBarTextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 1.5rem;
`;

const EmotionBarContentWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
`;

const EmotionStreakBar = styled.div`
  width: 14rem;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;

const EmotionStreak = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const DiaryAnalysisModalSubItemWrapper = styled.div`
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.3%;

  overflow: hidden;
`;

const DiaryAnalysisModalTitleWrapper = styled.div`
  width: ${(props) => props.width || "80%"};
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DiaryAnalysisModalText = styled.div`
  font-size: ${(props) => props.size || "1.3rem"};
  color: ${(props) => props.color || "#ffffff"};
`;

const DiaryAnalysisModalContentWrapper = styled.div`
  width: 100%;
  height: 65%;
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  justify-content: center;
  align-items: center;
`;

const MonthGraphBar = styled.div`
  width: 80%;
  height: 65%;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  gap: 5%;
`;

const MonthGraphWrapper = styled.div`
  width: 0.8rem;
  height: 70%;
  padding-bottom: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 10%;
`;

const MonthGraph = styled.div`
  width: 120%;
  height: ${(props) => props.height || "100%"};
  background-color: #bbbbbb;
  border-radius: 0.2rem;
`;

const TagRankingWrapper = styled.div`
  width: 80%;
  height: 15%;
  padding-bottom: 7%;
  display: flex;
  align-items: center;
  gap: 5%;
`;

const TagRankingTextWrapper = styled.div`
  width: 5rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
`;

const ShapeRankingWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const ShapeRankingTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 10%;
`;

const LogoNoText = styled.img`
  width: 30%;
  height: 30%;

  filter: brightness(0.6);
`;

export default DiaryAnalysisModal;
