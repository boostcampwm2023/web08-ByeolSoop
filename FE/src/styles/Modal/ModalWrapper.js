import styled from "styled-components";

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  position: fixed;
  gap: 1rem;
  top: ${(props) => props.$top || "50%"};
  left: ${(props) => props.$left || "50%"};
  z-index: 1001;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transform: translate(-50%, -50%);
  border-radius: ${(props) => props.$borderRadius || "1rem"};
  padding-top: ${(props) => props.$paddingTop || "4rem"};
  padding-bottom: ${(props) => props.$paddingBottom || "4rem"};
  padding-left: 4rem;
  padding-right: 4rem;
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

export default ModalWrapper;
