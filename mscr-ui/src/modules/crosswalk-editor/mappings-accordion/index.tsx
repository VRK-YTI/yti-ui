import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {styled} from '@mui/material';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {Button as Sbutton, DropdownItem, SearchInput, Textarea, TextInput} from 'suomifi-ui-components';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckIcon from '@mui/icons-material/Check';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import {NodeMapping} from '@app/common/interfaces/crosswalk-connection.interface';
import {InfoIcon} from '@app/common/components/shared-icons';
import {useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import {SearchWrapper} from "@app/modules/crosswalk-editor/mappings-accordion/mappings-accordion.styles";


const StyledTableCell = styled(TableCell)({
  height: 'auto',
  minHeight: '52px',
  display: 'flex',
  padding: '0px 20px',
  justifyContent: 'center',
  flexDirection: 'column',
  alignSelf: 'flex-start'
});

const StyledTableButtonCell = styled(TableCell)({
  height: 'auto',
  minHeight: '52px',
  display: 'flex',
  padding: '0px 20px',
  justifyContent: 'right',
  flexDirection: 'row',
  alignSelf: 'flex-start'
});

const StyledButton = styled(Button)({
  display: 'flex',
  justifyContent: 'start',
});


const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    //backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Row(props: {
  row: NodeMapping;
  viewOnlyMode: boolean;
  isEditModeActive: boolean;
  callBackFunction: any;
  showAttributeNames: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow className="accordion-row row">
        <StyledTableCell className="col-5">
          {props.row.source.map((oneLink) =>
            <>          <StyledButton
              className="px-3 py-0"
              style={{textTransform: 'none'}}
              title="Select linked node from source tree"
              onClick={(e) => {
                props.callBackFunction.performAccordionAction(
                  props.row,
                  props.row.source.length > 1 ? 'selectFromSourceTreeById' : 'selectFromSourceTreeByMapping',
                  oneLink.id
                );
                e.stopPropagation();
              }}
            >{props.showAttributeNames ? oneLink.label : oneLink.id}</StyledButton><br/></>
          )}

        </StyledTableCell>

        {/*                <StyledTableCell className='fw-bold' style={{width: '10%'}}>
                    <IconButton onClick={(e) => {props.cbf.performAccordionAction(row, 'remove'); e.stopPropagation();}} aria-label="unlink" color="primary" title='Unlink nodes'
                                size="large">
                    <LinkOffIcon/>
                    </IconButton>
                </StyledTableCell>*/}

        <StyledTableCell className="col-4">
          {props.row.target.map((oneLink) =>
            <>          <StyledButton
              className="px-3 py-0"
              style={{textTransform: 'none'}}
              title="Select linked node from target tree"
              onClick={(e) => {
                props.callBackFunction.performAccordionAction(
                  props.row,
                  props.row.target.length > 1 ? 'selectFromTargetTreeById' : 'selectFromTargetTreeByMapping',
                  oneLink.id
                );
                e.stopPropagation();
              }}
            >{props.showAttributeNames ? oneLink.label : oneLink.id}</StyledButton><br/></>
          )}

        </StyledTableCell>

        <StyledTableCell className="col-1">
          {/*<IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                            props.cbf.performAccordionAction(row, 'openMappingDetails')
                        }}
                    >
                        {row.isSelected ? <EditRoundedIcon className='selection-active'/> : <EditRoundedIcon/>}
                    </IconButton>*/}
        </StyledTableCell>

        <StyledTableButtonCell className="col-2 fw-bold">
          <IconButton
            hidden={props.viewOnlyMode}
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              setOpen(!open);
              e.stopPropagation();
            }}
          >
            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
          </IconButton>
        </StyledTableButtonCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell className="accordion-fold-content">
          <Collapse
            in={open && !props.viewOnlyMode}
            timeout="auto"
            unmountOnExit
          >
            <div className="row row ms-2 mt-2 mb-3">
              <div className='row col-12'>
                <div className="col-5 gx-0">
                  {/*                                <Box sx={{margin: 1}}>
                                    <div className='fw-bold mt-3 mb-2' style={{fontSize: '0.9em'}}>Mapping type: <span
                                        className='fw-normal'>exact match</span></div>
                                    <br/>
                                </Box>*/}
                  <div className="ms-0 mt-1 mb-2">
                    <div>Mapping type:</div>
                    <div className="fw-normal mt-2">{props.row.predicate}</div>
                  </div>
                  <br/>
                </div>
                <div className="col-5 mt-1 mx-3">
                  {props.row.notes &&
                      <>
                          <div>Notes:</div>
                          <div className="fw-normal mt-2">{props.row.notes}</div>
                      </>
                  }
                </div>
                <div className='col mt-4 d-flex flex-row gx-0 justify-content-end'>
                  <div className="d-flex flex-column action-buttons">
                    {props.isEditModeActive && (
                      <>
                        <Sbutton
                          onClick={(e) => {
                            props.callBackFunction.performAccordionAction(
                              props.row,
                              'openMappingDetails',
                            );
                          }}
                        >
                          Edit
                        </Sbutton>
                        <Sbutton
                          className="mt-2"
                          onClick={(e) => {
                            props.callBackFunction.performAccordionAction(
                              props.row,
                              'removeMapping',
                            );
                          }}
                        >
                          Delete
                        </Sbutton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    </>
  );
}

function filterMappings(nodeMappingsInput: NodeMapping[], value: string, showAttributeNames: boolean) {
  let results: NodeMapping[] = [];
  const searchString = value.toLowerCase();
  nodeMappingsInput.forEach(item => {
      if (item?.notes && item.notes.toLowerCase().includes(searchString)) {
        results.push(item);
      }
      item.source.forEach(src => {
        if (src.label.toLowerCase().includes(searchString)) {
          results.push(item);
        }
      });
      item.target.forEach(src => {
        if (src.label.toLowerCase().includes(searchString)) {
          results.push(item);
        }
      });
    }
  );
  return results;
}

export default function MappingsAccordion(props: any) {
  const {t} = useTranslation('common');
  const [mappingData, setMappingData] = React.useState<NodeMapping[]>([]);
  const [showAttributeNames, setShowAttributeNames] = React.useState<boolean>(true);
  useEffect(() => {
    setMappingData(props.nodeMappings);
    setShowAttributeNames(props.showAttributeNames);
  }, [props]);
  const nodeMappingsInput = props.nodeMappings;
  return (
    <>
      <TableContainer component={Paper} className="gx-0">
        <Table aria-label="collapsible table w-100">
          <TableHead>
            <TableRow className="accordion-row row">
              <StyledTableCell className="col-5">
                <span className="fw-bold ps-4">Source</span>
              </StyledTableCell>
              <StyledTableCell className="col-4">
                <span className="fw-bold ps-4">Target</span>
              </StyledTableCell>
              <StyledTableCell className="col-1"></StyledTableCell>
              <StyledTableCell className="col-2">
                <SearchWrapper className="w-100">
                  <SearchInput
                    labelText={''}
                    labelMode='hidden'
                    searchButtonLabel={t('mappings-accordion.filter-from-mappings')}
                    clearButtonLabel={t('mappings-accordion.clear')}
                    visualPlaceholder={t('mappings-accordion.filter-from-mappings')}
                    onSearch={(value) => {
                      if (typeof value === 'string') {
                        setMappingData(filterMappings(nodeMappingsInput, value, showAttributeNames));
                      }
                    }}
                    onChange={(value) => {
                      if (!value) {
                        setMappingData(props.nodeMappings);
                      }
                    }}
                  />
                </SearchWrapper>
              </StyledTableCell>
            </TableRow>
          </TableHead>

          {mappingData?.length > 0 && (
            <TableBody>
              {mappingData.map((row: NodeMapping) => {
                return (
                  <Row
                    key={row.pid}
                    row={row}
                    viewOnlyMode={props.viewOnlyMode}
                    isEditModeActive={props.isEditModeActive}
                    callBackFunction={props}
                    showAttributeNames={showAttributeNames}
                  />
                );
              })}
            </TableBody>
          )}
          {nodeMappingsInput?.length < 1 && (
            <TableBody>
              <TableRow className="">
                <td>
                  <div className="empty-mappings-table">
                    <div className="info-icon">
                      <InfoIcon></InfoIcon>
                    </div>
                    <div>
                      No elements have been mapped yet. Mappings will appear in
                      this table.
                    </div>
                  </div>
                </td>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  );
}
