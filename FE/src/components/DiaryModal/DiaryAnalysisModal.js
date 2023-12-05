import React from "react";
import styled from "styled-components";

function DiaryAnalysisModal() {
  return (
    <DiaryAnalysisModalWrapper>
      <DiaryAnalysisModalItem width='80%' height='53%'>
        <DiaryAnalysisModalTitleWrapper width='90%'>
          <DiaryAnalysisModalTitle>2023년의 감정</DiaryAnalysisModalTitle>
          <div>년도</div>
        </DiaryAnalysisModalTitleWrapper>
        <DiaryStreak>행복</DiaryStreak>
      </DiaryAnalysisModalItem>
      <DiaryAnalysisModalSubItemWrapper>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalTitle size='1.2rem'>
              월별 통계
            </DiaryAnalysisModalTitle>
          </DiaryAnalysisModalTitleWrapper>
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalTitle size='1.2rem'>
              가장 많이 쓴 태그 순위
            </DiaryAnalysisModalTitle>
          </DiaryAnalysisModalTitleWrapper>
        </DiaryAnalysisModalItem>
        <DiaryAnalysisModalItem height='100%'>
          <DiaryAnalysisModalTitleWrapper>
            <DiaryAnalysisModalTitle size='1.2rem'>
              가장 많이 쓴 모양 순위
            </DiaryAnalysisModalTitle>
          </DiaryAnalysisModalTitleWrapper>
        </DiaryAnalysisModalItem>
      </DiaryAnalysisModalSubItemWrapper>
    </DiaryAnalysisModalWrapper>
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
`;

const DiaryAnalysisModalTitleWrapper = styled.div`
  width: ${(props) => props.width || "80%"};
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DiaryAnalysisModalTitle = styled.div`
  font-size: ${(props) => props.size || "1.3rem"};
`;

export default DiaryAnalysisModal;
