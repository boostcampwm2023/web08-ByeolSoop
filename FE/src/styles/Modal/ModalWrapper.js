import styled from "styled-components";

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  position: fixed;
  gap: 1rem;
  top: 50%;
  left: ${(props) => props.left};
  z-index: 1001;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: rgba(255, 255, 255, ${(props) => props.opacity || 0.3});
  backdrop-filter: blur(10px);
  transform: translate(-50%, -50%);
  border-radius: 1rem;
  padding: 4rem;
  color: #ffffff;
`;

export default ModalWrapper;
