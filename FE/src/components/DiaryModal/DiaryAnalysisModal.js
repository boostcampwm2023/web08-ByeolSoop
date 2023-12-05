import React from "react";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import userAtom from "../../atoms/userAtom";
import shapeAtom from "../../atoms/shapeAtom";
import { preventBeforeUnload } from "../../utils/utils";
import Tag from "../../styles/Modal/Tag";

function DiaryAnalysisModal() {
  const [userState, setUserState] = useRecoilState(userAtom);

  async function getDataFn(data) {
    const currentYear = new Date().getFullYear();
    return fetch(`http://223.130.129.145:3005/stat/${data}/${currentYear}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userState.accessToken}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      if (res.status === 403) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        window.removeEventListener("beforeunload", preventBeforeUnload);
        window.location.href = "/";
      }
      if (res.status === 401) {
        return fetch("http://223.130.129.145:3005/auth/reissue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userState.accessToken}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (localStorage.getItem("accessToken")) {
              localStorage.setItem("accessToken", data.accessToken);
            }
            if (sessionStorage.getItem("accessToken")) {
              sessionStorage.setItem("accessToken", data.accessToken);
            }
            setUserState((prev) => ({
              ...prev,
              accessToken: data.accessToken,
            }));
          });
      }
      return {};
    });
  }

  const { data: diaryAnalysisData } = useQuery(["diaryAnalysis"], async () => {
    const result = await getDataFn("diaries");
    return result;
  });

  const { data: shapesRankData } = useQuery(["shapesRank"], async () => {
    const result = await getDataFn("shapes-rank");
    return result;
  });

  const { data: tagsRankData } = useQuery(["tagsRank"], async () => {
    const result = await getDataFn("tags-rank");
    return result;
  });

  return (
    <DiaryAnalysisModalWrapper>
      <DiaryAnalysisModalItem width='80%' height='53%'>
        <DiaryAnalysisModalTitleWrapper width='90%'>
          <DiaryAnalysisModalText>2023년의 감정</DiaryAnalysisModalText>
          <div>년도</div>
        </DiaryAnalysisModalTitleWrapper>
        <DiaryStreak>{diaryAnalysisData?.diaries}</DiaryStreak>
      </DiaryAnalysisModalItem>
      <DiaryAnalysisModalSubItemWrapper>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalText size='1.2rem'>
              월별 통계
            </DiaryAnalysisModalText>
          </DiaryAnalysisModalTitleWrapper>
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalText size='1.2rem'>
              가장 많이 쓴 태그 순위
            </DiaryAnalysisModalText>
          </DiaryAnalysisModalTitleWrapper>
          <DiaryAnalysisModalContentWrapper>
            <TagRanking
              rank={tagsRankData?.first.rank}
              tag={tagsRankData?.first.tag}
              count={tagsRankData?.first.count}
            />
            <TagRanking
              rank={tagsRankData?.second.rank}
              tag={tagsRankData?.second.tag}
              count={tagsRankData?.second.count}
            />
            <TagRanking
              rank={tagsRankData?.third.rank}
              tag={tagsRankData?.third.tag}
              count={tagsRankData?.third.count}
            />
          </DiaryAnalysisModalContentWrapper>
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalText size='1.2rem'>
              가장 많이 쓴 모양 순위
            </DiaryAnalysisModalText>
          </DiaryAnalysisModalTitleWrapper>
          <DiaryAnalysisModalContentWrapper direction='row'>
            <ShapeRanking
              rank={shapesRankData?.first.rank}
              uuid={shapesRankData?.first.uuid}
              count={shapesRankData?.first.count}
            />
            <ShapeRanking
              rank={shapesRankData?.second.rank}
              uuid={shapesRankData?.second.uuid}
              count={shapesRankData?.second.count}
            />
            <ShapeRanking
              rank={shapesRankData?.third.rank}
              uuid={shapesRankData?.third.uuid}
              count={shapesRankData?.third.count}
            />
          </DiaryAnalysisModalContentWrapper>
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

// 일기 나열 페이지와 중복되는 부분이 많아서 일단은 일기 나열 페이지를 재활용했습니다.
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
  align-items: center;

  font-size: 1.3rem;
  color: #ffffff;

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

const DiaryStreak = styled.div`
  width: 90%;
  height: 55%;
  border: 1px solid #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
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
  height: 80%;
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  justify-content: center;
  align-items: center;
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

export default DiaryAnalysisModal;
