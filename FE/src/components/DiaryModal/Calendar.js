import React, { useLayoutEffect } from "react";
import styled from "styled-components";
import toggleIcon from "../../assets/toggleIcon.svg";
import leftIcon from "../../assets/leftIcon.svg";
import rightIcon from "../../assets/rightIcon.svg";

function getCalendarDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDayOfWeek = lastDay.getDay();

  const firstDate = firstDay.getDate();
  const lastDate = lastDay.getDate();

  const calendarDate = [];

  for (let i = 0; i < firstDayOfWeek; i += 1) {
    calendarDate.push("");
  }

  for (let i = firstDate; i <= lastDate; i += 1) {
    calendarDate.push(i);
  }

  for (let i = lastDayOfWeek; i < 6; i += 1) {
    calendarDate.push("");
  }

  return calendarDate;
}

const getColor = (index) => {
  if (index % 7 === 0) {
    return "red";
  }
  if (index % 7 === 6) {
    return "blue";
  }
  return "black";
};

function Calendar(props) {
  const { date, setData } = props;
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [calendarDate, setCalendarDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useLayoutEffect(() => {
    setCalendarDate(date);
    setSelectedDate(date);
  }, [date]);

  return (
    <CalendarWrapper>
      <CalendarHeader onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
        <CalendarHeaderTitle>
          {selectedDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CalendarHeaderTitle>
        <CalendarButton
          className={isCalendarOpen ? "rotate" : "unrotate"}
          src={toggleIcon}
        />
      </CalendarHeader>
      {isCalendarOpen && (
        <CalendarBodyWrapper>
          <CalendarBodyHeaderWrapper>
            <ArrowButton
              src={leftIcon}
              onClick={() =>
                setCalendarDate(
                  new Date(
                    calendarDate.getFullYear(),
                    calendarDate.getMonth() - 1,
                    calendarDate.getDate(),
                  ),
                )
              }
            />
            <CalendarBodyHeader>
              {calendarDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
              })}
            </CalendarBodyHeader>
            <ArrowButton
              src={rightIcon}
              onClick={() =>
                setCalendarDate(
                  new Date(
                    calendarDate.getFullYear(),
                    calendarDate.getMonth() + 1,
                    calendarDate.getDate(),
                  ),
                )
              }
            />
          </CalendarBodyHeaderWrapper>
          <CalendarBody>
            <CalendarBodyDayWrapper>
              {["일", "월", "화", "수", "목", "금", "토"].map((item) => (
                <CalendarBodyDay key={item}>{item}</CalendarBodyDay>
              ))}
            </CalendarBodyDayWrapper>
            <CalendarBodyDateWrapper>
              {getCalendarDate(calendarDate).map((item, index) => (
                <CalendarBodyDate
                  key={`${index + 1}`}
                  onClick={
                    item === ""
                      ? () => {}
                      : () => {
                          setSelectedDate(
                            new Date(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth(),
                              item,
                            ),
                          );
                          setData((prev) => ({
                            ...prev,
                            date: new Date(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth(),
                              item,
                            ),
                          }));
                        }
                  }
                >
                  <CalendarBodyDateNumber color={getColor(index)}>
                    {item}
                  </CalendarBodyDateNumber>
                </CalendarBodyDate>
              ))}
            </CalendarBodyDateWrapper>
          </CalendarBody>
        </CalendarBodyWrapper>
      )}
    </CalendarWrapper>
  );
}

const CalendarWrapper = styled.div`
  height: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
`;

const CalendarHeader = styled.div`
  height: 100%;
  z-index: 3000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.8rem;
`;

const CalendarHeaderTitle = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.2rem;
`;

const CalendarButton = styled.img`
  width: 0.9rem;
  height: 0.9rem;

  position: relative;
  top: -0.1rem;

  &.rotate {
    transform: rotate(-180deg);
    transition: transform 0.25s;
  }

  &.unrotate {
    transform: rotate(0deg);
    transition: transform 0.25s;
  }
`;

const CalendarBodyWrapper = styled.div`
  width: 15rem;
  padding: 1rem;
  z-index: 2000;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  position: absolute;
  top: 5.5rem;
  left: 3.5rem;

  background-color: #bbc2d4;
  border-radius: 0.5rem;

  cursor: default;
`;

const CalendarBody = styled.div`
  width: 100%;
  color: black;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CalendarBodyHeaderWrapper = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: black;
`;

const CalendarBodyHeader = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowButton = styled.img`
  width: 0.7rem;
  height: 0.7rem;
  cursor: pointer;
`;

const CalendarBodyDayWrapper = styled.div`
  width: 100%;
  height: 1.8rem;
  background-color: #000000dd;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 0.8rem;
`;

const CalendarBodyDay = styled.div`
  width: 14%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CalendarBodyDateWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const CalendarBodyDate = styled.div`
  width: 14%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const CalendarBodyDateNumber = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.color};
  font-size: 0.8rem;
`;

export default Calendar;
