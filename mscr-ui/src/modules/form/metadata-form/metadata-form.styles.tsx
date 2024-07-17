import styled from 'styled-components';
import { Grid } from '@mui/material';
import { Heading } from 'suomifi-ui-components';

export const MetadataContainer = styled.div`
  color: ${(props) => props.theme.suomifi.colors.blackBase};
`;

export const MetadataHeading = styled(Heading)`
  && {
    font-size: 1.2rem;
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    margin-bottom: 0.5em;
  }
`;

export const MetadataFormContainer = styled(Grid)`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  padding: 1rem;
`;

export const MetadataRow = styled(Grid)`
  font-size: 0.9rem;
  height: 60px;
  margin-top: 8px;
`;

export const MetadataLabel = styled.p`
  font-weight: bold;
  margin-top: 8px;
`;

export const MetadataAttribute = styled.p`
  font-size: 16px;
  margin-left: 11px;
  margin-top: 8px;
`;
