import styled from 'styled-components';
import { SearchInput } from 'suomifi-ui-components';

export const MscrSearchInput = styled(SearchInput)`
  // Something goes wrong if you use the labelMode='hidden' argument in SearchInput, so this is a workaround
  .fi-label {
    position: absolute;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }
`;
