import styled from 'styled-components';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export const StyledTab = styled(Tab)`
  &&& {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
    text-transform: none;
    font-size: 18px;
  }
  &&.Mui-selected {
    font-weight: 800;
  }

  // Individual widths to keep the style of varying widths but without janky transitions because selected tab is bolded
  &&.metadata-and-files-tab {
    width: 180px;
  }

  &&.content-and-editor-tab {
    width: 100px;
  }

  &&.history-tab {
    width: 150px;
  }
`;

export const StyledTabs = styled(Tabs)`
  margin-bottom: 1em;
  && .MuiTabs-indicator {
    border-bottom: 4px solid
      ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;
