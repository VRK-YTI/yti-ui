import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const InfoBlockTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
`;

export const InfoBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  max-width: 695px;
`;
