import styled from 'styled-components';
import { StaticChip } from 'suomifi-ui-components';

export const StatusChip = styled(StaticChip)<{ status?: string }>`
  background-color: ${(props) => {
    switch (props.status) {
      case 'DRAFT':
      case 'INCOMPLETE':
        return props.theme.suomifi.colors.depthLight2;
      case 'SUGGESTED':
        return props.theme.suomifi.colors.warningBase;
      case 'VALID':
        return props.theme.suomifi.colors.successBase;
      case 'SUPERSEDED':
        return props.theme.suomifi.colors.alertBase;
      case 'RETIRED':
      default:
        return props.theme.suomifi.colors.alertBase;
    }
  }} !important;

  ${(props) =>
    props.status &&
    ['DRAFT', 'INCOMPLETE', 'SUGGESTED'].includes(props.status) &&
    `color: ${props.theme.suomifi.colors.blackBase} !important;`}

  font-size: 12px;
  line-height: 0;
  padding: 0px 10px !important;
  text-transform: lowercase;
  vertical-align: bottom;

  ::first-letter {
    text-transform: capitalize;
  }
`;
