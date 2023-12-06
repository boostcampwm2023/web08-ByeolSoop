import styled from "styled-components";

const ModalButton = styled.button`
  width: 100%;
  height: 3.5rem;
  border: none;
  border-radius: 0.2rem;
  background-color: ${(props) => props.$bg || "#3b4874"};

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  font-family: "pretendard-medium";
  font-size: ${(props) => props.fontSize || "1.25rem"};
  color: ${(props) => props.color || "#ffffff"};

  cursor: pointer;
`;

export default ModalButton;
