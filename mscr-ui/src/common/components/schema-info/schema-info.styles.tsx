import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';

export const SchemaHeading = styled(Heading)`
  && {
    font-size: 1.2rem;
  }
  color: ${(props) => props.theme.suomifi.colors.depthDark2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TreeviewWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-radius: 5px;
`;

export const ExpandButtonWrapper = styled.div`
  margin-top: 37px;
  margin-right: 15px;
`;

export const SearchWrapper = styled.div`
  && .fi-search-input {
    width: 100%;
  }
`;

export const DropdownWrapper = styled.div`
  margin-top: -5px;
  margin-bottom: 15px;

  && .fi-dropdown_button {
    min-width: 100%;
    width: 100%;
  }

  .fi-dropdown {
    width: 100%;
  }
`;

export const NodeInfoWrapper = styled.div`
  color: #6b6b6b;
  background: #d8e3f4;

  .node-info-box {
    min-height: 175px;
    font-size: 0.95rem;
    margin: 0;

    .source-to-destination-wrap {
      min-height: 42px;

      button {
        padding: 0;
      }

      .arrow-icon {
        margin: 0 15px;
        font-size: 1.3rem;
      }
    }
  }

  .attribute-font {
    font-size: 0.9rem;
    line-height: 1.3rem;
    margin-bottom: 2px;
    color: #2b2b2b;
    margin-top: -2px;
    inline-size: 100%;
    overflow-wrap: break-word;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: normal;
    margin-bottom: 0;
    padding: 17px 14px 0 17px;
  }

  .side-bar-wrap {
    padding: 5px 5px;
  }

  .bg-wrap {
    font-size: 0.95rem;
    background: #fff;
    padding: 15px;
    min-height: 377px;
    max-width: 500px;
  }
`;
