import styled from 'styled-components';

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 101;
  background-color: #282828;
  opacity: 0.5;
`;

export const ModalWindow = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 102;
  overflow: hidden;
  outline: 0;
`;

export const ModalDialog = styled.div`
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  pointer-events: none;
  max-width: 40%;
  width: auto;
`;

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(40, 40, 40, 0.2);
  border-radius: 0;
  outline: 0;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const ModalBody = styled.div`
  display: inline-block;
  width: 100%;
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
`;

export const ModalFooter = styled.div`
  justify-content: flex-start;
  border-top: none;
  display: flex;
  align-items: center;
  padding: 1rem;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`;

export const ColMd12 = styled.div`
  flex: 0 0 100%;
  max-width: 100%;
  position: relative;
  width: 100%;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
`;
