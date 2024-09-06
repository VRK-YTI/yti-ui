import styled from 'styled-components';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';

export const AccordionContainer = styled(TableContainer)({
  overflow: 'hidden'
});

export const SearchWrapper = styled.div`
  && .fi-search-input {
    max-width: 300px;
    margin: 15px 5px;
    //margin: -5px 0px -10px 0px;
  }
`;

export const StyledArrowRightIcon = styled(ArrowRightIcon)({
  color: '#d8e3f4',
  margin: '6px -6px 6px -8px'
});


export const StyledTableCell = styled(TableCell)({
  height: 'auto',
  minHeight: '52px',
  display: 'flex',
  padding: '0px 0px 0px 0px',
  justifyContent: 'center',
  flexDirection: 'column',
  alignSelf: 'normal',
});

export const StyledTableTargetCell = styled(TableCell)({
  height: 'auto',
  minHeight: '52px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignSelf: 'normal',
  paddingLeft: '136px',
});

export const StyledTableActionsCell = styled(TableCell)({
  height: 'auto',
  minHeight: '52px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignSelf: 'normal',
  textAlign: 'right',
  paddingRight: '47px'
});

export const StyledTableButtonCell = styled(TableCell)({
  textAlign: 'end',
  display: 'flex',
  justifyContent: 'end',
  padding: '0px 15px',
  Sbutton: {
    padding: '0px 15px'
  }
});

export const StyledButton = styled(Button)({
  display: 'flex',
  justifyContent: 'start',
  alignSelf: 'normal',
  textTransform: 'none',
  textAlign: 'initial',
  lineHeight: '1.3rem',
  padding: '0px'
});

export const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    //backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const StooltipContainer = styled.div`
  width: 30px;
  margin-left: -30px;
  .fi-tooltip_content {
    position: absolute;
    z-index: 4;
    width: 210px;
  }
  .fi-tooltip_toggle-button {
    visibility: hidden;
  }
`;

export const TableCellPadder = styled.div`
  display: flex;
  padding: 0px 15px 0px 20px;
`;

export const IconCircle = styled.div`
  background: hsl(212, 63%, 37%);
  height: 30px;
  width: 30px;
  margin: 4px -30px 4px 0px;
  border-radius: 40px;
  cursor: pointer;
  z-index: 0;
  svg {
    margin-top: 4px;
    margin-left: 7px;
  }
`;

export const IconCircleMid = styled.div`
  background: hsl(212, 63%, 37%);
  height: 30px;
  width: 30px;
  margin: 4px;
  flex-shrink: 0;
  border-radius: 40px;
  cursor: pointer;
  z-index: 0;
  svg {
    margin-top: 4px;
    margin-left: 7px;
  }
`;

export const IconLetterWrap = styled.div`
  margin-left: 10px;
  color: #fff;
  font-size: 1.1rem;
`;

export const IconSpacer = styled.div`
  height: 40px;
  width: 70px;
`;

export const HorizontalLineStart = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
  margin-right: -15px;
  left: 15px;
`;

export const HorizontalLineStartSecond = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
  max-width: 20px;
  min-width: 40px;
`;

export const HorizontalLineMidStart= styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  margin-right: -70px;

  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
`;

export const HorizontalLineMidEnd= styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  margin-left: -45px;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
`;

export const HorizontalLineTarget= styled.div`
  margin-right: -8px;
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
  max-width: 40px;
  min-width: 115px;
`;

export const HorizontalLineTargetStart = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
  min-width: 50px;
  margin-right: -13px;
`;

export const HorizontalLineTargetEnd = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-size: 1.1rem;
  div {
    height: 2px;
    background: #d8e3f4;
    margin-left: -5px;
    margin-right: 5px;
  }
  min-width: 40px;
  margin-right: -8px;
`;



export const VerticalLine = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
  color: #fff;
  font-size: 1.1rem;
  height: 100%;
  div {
    width: 2px;
    background: #d8e3f4;
    margin-left: -5px;
  }
`;

export const EmptyBlock = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: row;
  color: #fff;
  height: 100%;
  margin: -1px 0px;
`;
