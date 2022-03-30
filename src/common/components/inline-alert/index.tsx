import styled from 'styled-components';
import { InlineAlert as SuomiFiInlineAlert } from 'suomifi-ui-components';

const InlineAlert = styled(SuomiFiInlineAlert)<{ noIcon?: boolean }>`
  .fi-alert_icon-wrapper {
    ${(props) => (props.noIcon ? 'display: none;' : '')}
  }
`;

export default InlineAlert;
