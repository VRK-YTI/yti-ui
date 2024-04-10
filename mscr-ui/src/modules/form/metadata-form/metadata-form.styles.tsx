import styled from 'styled-components';
import { Grid } from '@mui/material';

export const MetadataContainer = styled.div`
  color: ${(props) => props.theme.suomifi.colors.blackBase};
  margin: 0 .5rem;
  h2 {
    color: #6b6b6b;
    font-size: 1.2rem;
    font-weight: bold;
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
