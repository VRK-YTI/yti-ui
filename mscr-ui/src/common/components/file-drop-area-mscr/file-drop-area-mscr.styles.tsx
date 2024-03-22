import styled from 'styled-components';
import {Block, Button, IconFileGeneric, TextInput} from 'suomifi-ui-components';
import {UploadIcon} from 'mscr-ui/src/common/components/shared-icons';

export const FileBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  border: 1px dashed ${(props) => props.theme.suomifi.colors.highlightLight1};
  display: flex;
  flex-direction: column;
  align-items: center;
  input { width: 100% !important; }
  border-radius: 2px;
  svg:first-of-type {margin: 0px 0px -62px 0px};
  svg {margin: 0px 0px 35px 0px};
`;

export const WideTextInput = styled(TextInput)`
  width: 100%;
`;

export const FileBlockWrapper = styled(Block)`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: 15px;
`;

export const FileInfo = styled.div`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.s};

  div {
    .fi-paragraph:nth-child(2) .fi-text {
      font-size: 16px;
    }

    .fi-paragraph:nth-child(3) .fi-text {
      font-size: 14px;
    }
  }
`;

export const FileInfoBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: ${(props) => props.theme.suomifi.spacing.s};
  display: flex;
  justify-content: space-between;
`;

export const FileInfoStaticIcon = styled(IconFileGeneric)`
  height: 24px;
  width: 20px;
`;

export const CaptionText = styled(Block)`
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  margin: 10px 0px 10px 0px;
`;

export const FileRemoveButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > :first-child {
    margin-left: ${(props) => props.theme.suomifi.spacing.xxs};
  }
`;

export const FileWrapper = styled.div`
  margin-top: ${(props) => props.theme.suomifi.spacing.l};
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.l};
`;
