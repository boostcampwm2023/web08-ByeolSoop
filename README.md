 <img width="100%" alt="image" src="https://github.com/boostcampwm2023/web08-ByeolSoop/assets/44529556/a2b6f2c0-51db-46e8-a52a-bdd97a3d11e5">

<div align="center">
   <h1> 별숲 </h1>
   <h3>💫 당신의 이야기를 잇는, 밤하늘 별자리 다이어리 💫</h3>

<p>
  <a href="https://www.byeolsoop.site">별숲 홈페이지</a>
</p>
  <p>
  <a href="https://www.notion.so/551e1070f73a405badb8aeb178dac192?pvs=21">서비스 가이드</a>
  &nbsp; | &nbsp; 
  <a href="https://byeolsoop.notion.site/Notion-6ee66b92d165412e9954c35d223cfab4?pvs=4">노션</a>
  &nbsp; | &nbsp; 
  <a href="https://github.com/boostcampwm2023/web08-ByeolSoop/wiki">위키</a>
</p>
</div>

## 📢  프로젝트 소개

###  별숲에 작성하는 일기장 서비스

`#일기` `#개인화` `#밤하늘` `#3D` `#감정분석` `#연결`

> "별숲"의 사전적 의미는 별들이 총총 떠 있는 하늘을 비유적으로 이르는 말입니다.  <br>
> 이처럼 별들이 가득한 밤하늘의 이미지를 바탕으로, 일기장 서비스를 기획하였습니다.

별숲은 3D 밤하늘에 사용자의 일기를 별의 형태로 그려나갈 수 있는 서비스입니다. <br>
사용자는 별의 모양을 커스텀하고, 별과 별 사이를 연결해 자신만의 별자리를 만들 수 있습니다. <br>
이와 함께, 감정분석 기능을 통해 작성된 일기의 감정에 따라 별의 색상이 변화하며, 사용자만의 감성적인 밤하늘을 꾸밀 수 있습니다.

<br>
<img width="600" alt="smile" src="https://github.com/boostcampwm2023/web08-ByeolSoop/assets/44529556/6487f421-305d-4770-af37-16fde97c2f30">
<br>

## 🔎  주요 기능

### ✦ 밤하늘에 오늘 하루 이야기를 담은 나만의 별을 수놓아보세요.
별숲은 `three.js`와 `React-Three-Fiber`를 결합하여 3D 밤하늘을 구현하였습니다. <br>
별처럼 빛나는 기억과 생각을 별의 형태로 밤하늘에 그려나갈 수 있습니다.

![byeolsoop_1](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/7c5ffb0b-2d09-4994-a999-0bc346f690fc)

<br>

### ✦ 모양과 태그로 나만의 별을 기억하세요.
별의 모양을 커스텀하거나 태그를 편집하는 등의 개인화 기능을 통해, 자신만의 이야기와 감성이 담긴 별을 만들어낼 수 있습니다.

![byeolsoop_2](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/9fb35383-7fd3-4cdd-8362-563fced82973)

<br>

### ✦ 그 날의 감정이 고스란히 녹아든 예쁜 별들이 하늘에 피어납니다.
Ncloud의 CLOVA Sentiment를 활용하여 작성된 일기의 감정을 분석합니다. <br>
이를 통해 각 별의 색상이 감정에 따라 변화하며, 사용자의 감정 상태를 시각적으로 표현합니다.

![byeolsoop_3](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/b6160239-82be-497b-8ed3-4d785bbd5a9d)

<br>

### ✦ 별을 연결해 나만의 별자리를 만들어보세요.
별과 별 사이에 연결선을 그려 개인만의 별자리를 구성할 수 있습니다. <br>
이 기능은 일기를 더욱 특별하게 만들며, 사용자의 감정과 추억을 별자리로 연결하여 시각화합니다.

![byeolsoop_4](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/c0f7e78b-a31b-47d8-8063-7b7a0815df3a)

<br>

### ✦ 모양이나 태그 등을 통해 내가 쓴 별들을 모아볼 수 있어요.

![byeolsoop_5](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/18266aea-ec7f-4170-8a05-da4a95eb3234)

<br>

### ✦ 1년 동안 쌓인 별들의 아름다운 기록을 살펴보세요.

![byeolsoop_6](https://github.com/boostcampwm2023/web08-ByeolSoop/assets/49023654/4273665a-e006-407e-a7b3-e712fa00a19b)

<br>

## 💥  기술적 도전

### 프론트엔드
| 기능 | 상세 내용 |
|---|---|
|밤하늘 3D 뷰 구현| • `three.js` + `R3F` 활용한 별 / 별자리 / 밤하늘 3D 구현 <br> • UX를 위한 클릭 / 더블 클릭 이벤트 시점 이동 알고리즘 구현 <br> • Web API를 활용해 SVG 파일을 재질로 변환 |
|일기 데이터 관리| • 서비스 특성 상 빈번하게 발생할 데이터 변환을 고려 <br> • `Recoil` 라이브러리를 활용한 atomic 데이터 관리 <br> • `react-query` 라이브러리를 활용한 로딩 / 에러 처리 및 최신 데이터 유지|
|일기 데이터 가공| • 사용자들에게 일기 목록 / 현황을 제공하기 위한 데이터 가공 <br> • `react-datepicker` 라이브러리를 활용한 날짜 범위 필터링 서비스 제공 <br> • `Day.js` 라이브러리를 활용한 일기 스트릭 서비스 제공
### 백엔드
| 기능 | 상세 내용 |
|---|---|
|개인 데이터 접근 제어| • JWT 인증을 통해 로그인용 액세스 / 리프레시 토큰을 발급하고 저장 <br> • `JwtAuthGuard`를 사용하여 부적절한 로그인 및 중복 로그인 방지<br> • `PrivateDiaryGuard`를 사용하여 타인의 일기 접근 제어|
|명확한 테스트 코드| • 테스트 코드 규칙 정의<br> • 내부 및 외부 의존성에 대한 테스트 코드 작성<br> • `typeorm-transactional-tests` 라이브러리를 활용하여 트랜잭션 적용|




<br>

## ⚒️  기술 스택 

| 분류 | 기술 |
| ---- | ---- |
| 프론트엔드 | <img src="https://img.shields.io/badge/JavaScript-%23323330?style=flat-square&logo=JavaScript&logoColor=%23F7DF1E"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/styled_components-DB7093?style=flat-square&logo=styled-components&logoColor=white"/> <img src="https://img.shields.io/badge/Recoil-3626B1?style=flat-square&logo=recoil&logoColor=white"/> <img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=react-query&logoColor=white"/> <img src="https://img.shields.io/badge/three.js-000000?style=flat-square&logo=three.js&logoColor=white"/> <img src="https://img.shields.io/badge/React_Three_Fiber-20232A?style=flat-square&logo=react&logoColor=61DAFB"/> |
| 백엔드 | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=ffffff"> <img src="https://img.shields.io/badge/Nest.js-E0234E?style=flat-square&logo=NestJS&logoColor=white"/> <img src="https://img.shields.io/badge/TypeORM-FF4716?style=flat-square&logo=typeorm&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/Jest-341f0e?style=flat-square&logo=jest&logoColor=FF0000"> <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white"/> |
| 배포 | <img src="https://img.shields.io/badge/Naver Cloud Platform-03C75A?style=flat-square&logo=naver&logoColor=ffffff"> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Nginx-014532?style=flat-square&logo=Nginx&logoColor=009639&"> <img src="https://img.shields.io/badge/Github Actions-2671E5?style=flat-square&logo=GitHub%20Actions&logoColor=white"/> |
| 협업 도구 | <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white" /> <img src="https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white"/> <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion"> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=ffffff"> <img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=Slack&logoColor=ffffff"> |


<br>

## ⚙️  시스템 아키텍처

<img width="600" src="https://github.com/boostcampwm2023/web08-ByeolSoop/assets/44529556/08e1c115-2799-450f-bf5f-eb97361fe1db">

## 👥  팀원 소개
|<img src="https://github.com/dmson1218.png" width="100">|<img src="https://github.com/dbwhdtjr0457.png" width=100>|<img src="https://github.com/JoonSoo-Kim.png" width=100>|<img src="https://github.com/mingxoxo.png" width="100">|
|:--:|:--:|:--:|:--:|
|[J069 손동민](https://github.com/dmson1218)|[J085 유종석](https://github.com/dmson1218)|[J032 김준수](https://github.com/JoonSoo-Kim)|[J114 이정민](https://github.com/mingxoxo)|
|FE|FE|BE|BE|

- 더 자세한 내용은 [📄Wiki](https://github.com/boostcampwm2023/web08-ByeolSoop/wiki) 를 확인해주세요!
