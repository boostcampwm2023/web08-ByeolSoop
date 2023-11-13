import React from "react";
import styled from "styled-components";
import logo from "../../assets/logo.png";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt='logo'
        style={{
          height: "40px",
          width: "40px",
          margin: "0 10px",
        }}
      />
      <HeaderTitle>Header</HeaderTitle>
    </header>
  );
}

export const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding: 0;
`;
