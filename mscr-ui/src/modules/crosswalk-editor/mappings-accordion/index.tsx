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
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {
  Button as Sbutton,
  Tooltip as Stooltip,
  DropdownItem,
  Heading,
  SearchInput,
  Textarea,
  TextInput
} from 'suomifi-ui-components';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckIcon from '@mui/icons-material/Check';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Tooltip from '@mui/material/Tooltip';

import {NodeMapping} from '@app/common/interfaces/crosswalk-connection.interface';
import {FunctionIcon, InfoIcon} from '@app/common/components/shared-icons';
import {useEffect} from 'react';
import {useTranslation} from 'next-i18next';
import {
  EmptyBlock,
  HorizontalLineStart,
  HorizontalLineMidEnd,
  HorizontalLineMidStart,
  HorizontalLineTarget,
  IconCircle,
  IconCircleMid,
  IconLetterWrap,
  IconSpacer,
  SearchWrapper,
  StooltipContainer,
  StyledArrowRightIcon,
  StyledButton,
  StyledTableButtonCell,
  StyledTableCell,
  StyledTableTargetCell,
  StyledTableActionsCell,
  StyledTableRow,
  TableCellPadder,
  VerticalLine, HorizontalLineTargetStart, HorizontalLineTargetEnd, HorizontalLineStartSecond, AccordionContainer
} from '@app/modules/crosswalk-editor/mappings-accordion/mappings-accordion.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styled from 'styled-components';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FunctionTooltipBox from "@app/modules/crosswalk-editor/mappings-accordion/function-tooltip-box";

export interface highlightOperation {
  operationId: string;
  nodeId?: any;
}

function Row(props: {
  row: NodeMapping;
  viewOnlyMode: boolean;
  isEditModeActive: boolean;
  callBackFunction: any;
  showAttributeNames: boolean;
  rowcount: number;
  mappingFunctions: any;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow className="accordion-row row">
        <StyledTableCell className="col-4">

          {props.row.source.map((mapping, index) => {
              return (<>
                <div className='d-flex justify-content-between'>
                  <div className='d-flex justify-content-center'>
                    <TableCellPadder>
                      <StyledButton
                        className="px-3 py-0"
                        style={{textTransform: 'none'}}
                        title="Select linked node from source tree"
                        onClick={(e) => {
                          props.callBackFunction.performAccordionAction(
                            props.row,
                            props.row.source.length > 1 ? 'selectFromSourceTreeById' : 'selectFromSourceTreeByMapping',
                            mapping.id
                          );
                          e.stopPropagation();
                        }}
                      >{props.showAttributeNames ? mapping.label : mapping.id}</StyledButton>

                      <HorizontalLineStart>
                        <div></div>
                      </HorizontalLineStart>
                    </TableCellPadder>
                  </div>
                  <StyledArrowRightIcon></StyledArrowRightIcon>
                  <HorizontalLineStart>
                    <div></div>
                  </HorizontalLineStart>
                  {mapping['processing']?.id &&
                      <FunctionTooltipBox callBackFunction={props.callBackFunction}
                                          isEditModeActive={props.isEditModeActive}
                                          tooltipHeading={'source operation'} tooltipHoverText={'source operation'}
                                          processingId={mapping.id} functionName={'sourceOperation'}
                                          mappingFunctions={props.mappingFunctions}
                                          row={props.row}></FunctionTooltipBox>
                  }
                  <HorizontalLineStartSecond>
                    <div></div>
                  </HorizontalLineStartSecond>
                  <div className='d-flex flex-column'>
                    {index === 0 && props.row.source.length > 1 && <EmptyBlock></EmptyBlock>}
                    {props.row.source.length > 1 && <VerticalLine>
                        <div></div>
                    </VerticalLine>}
                    {index === props.row.source.length - 1 && props.row.source.length > 1 && <EmptyBlock></EmptyBlock>}
                  </div>
                </div>
              </>)
            }
          )}

        </StyledTableCell>

        <StyledTableCell className='col-2'>
          <div className='d-flex justify-content-center'>
            <HorizontalLineMidStart>
              <div></div>
            </HorizontalLineMidStart>
            {props.row.processing &&
                <FunctionTooltipBox callBackFunction={props.callBackFunction} isEditModeActive={props.isEditModeActive}
                                    tooltipHeading={'mapping function'} tooltipHoverText={'mapping function'}
                                    processingId={props.row.processing.id} functionName={'mappingFunction'}
                                    mappingFunctions={props.mappingFunctions} row={props.row}></FunctionTooltipBox>
            }
            {!props.row.processing &&
                <IconSpacer></IconSpacer>
            }
            {props.row.predicate &&
                <FunctionTooltipBox alternateIconLetter={'P'} callBackFunction={props.callBackFunction}
                                    isEditModeActive={props.isEditModeActive} tooltipHeading={'predicate'}
                                    processingId={''} tooltipHoverText={'predicate'} functionName={'predicate'}
                                    mappingFunctions={props.mappingFunctions} row={props.row}></FunctionTooltipBox>
            }
            {!props.row.predicate &&
                <IconSpacer></IconSpacer>
            }
            <HorizontalLineMidEnd>
              <div></div>
            </HorizontalLineMidEnd>
          </div>
        </StyledTableCell>

        <StyledTableCell className="col-4">
          <div className='d-flex flex-column'>
            {props.row.target.map((mapping, index) => {
                return (<>
                  <div className='d-flex justify-content-between'>
                    <div className='d-flex justify-content-center'>
                      <div className='d-flex flex-column'>
                        {index === 0 && props.row.target.length > 1 && <EmptyBlock></EmptyBlock>}
                        {props.row.target.length > 1 && <VerticalLine>
                            <div></div>
                        </VerticalLine>}
                        {index === props.row.target.length - 1 && props.row.target.length > 1 &&
                            <EmptyBlock></EmptyBlock>}
                      </div>
                      {mapping['processing']?.id &&
                          <><HorizontalLineTargetStart>
                              <div></div>
                          </HorizontalLineTargetStart><FunctionTooltipBox callBackFunction={props.callBackFunction}
                                                                          isEditModeActive={props.isEditModeActive}
                                                                          tooltipHeading={'target operation'}
                                                                          tooltipHoverText={'target operation'}
                                                                          processingId={mapping.id}
                                                                          functionName={'targetOperation'}
                                                                          mappingFunctions={props.mappingFunctions}
                                                                          row={props.row}></FunctionTooltipBox><HorizontalLineTargetEnd>
                              <div></div>
                          </HorizontalLineTargetEnd></>
                      }{!mapping['processing']?.id && <HorizontalLineTarget><div></div></HorizontalLineTarget>}
                      <StyledArrowRightIcon></StyledArrowRightIcon>
                      <StyledButton
                        className="px-3 py-0"
                        style={{textTransform: 'none'}}
                        title="Select linked node from target tree"
                        onClick={(e) => {
                          props.callBackFunction.performAccordionAction(
                            props.row,
                            props.row.target.length > 1 ? 'selectFromTargetTreeById' : 'selectFromTargetTreeByMapping',
                            mapping.id
                          );
                          e.stopPropagation();
                        }}
                      >{props.showAttributeNames ? mapping.label : mapping.id}</StyledButton>
                    </div>
                  </div>
                </>)
              }
            )}
          </div>

        </StyledTableCell>

        <StyledTableButtonCell className="col-2 fw-bold">
          <>
            <div className='d-flex flex-row flex-wrap align-content-center'>
              <>
                <Tooltip
                  title={props.isEditModeActive ? 'Edit mapping' : 'Activate edit mode to edit mapping'}
                  placement="bottom"
                >
                  <Sbutton
                    disabled={!(props.isEditModeActive)}
                    onClick={(e) => {
                      props.callBackFunction.performAccordionAction(
                        props.row,
                        'openMappingDetails'
                      );
                    }}
                  >
                    Edit
                  </Sbutton>
                </Tooltip>
                <Tooltip
                  title={props.isEditModeActive ? 'Delete mapping' : 'Activate edit mode to delete mapping'}
                  placement="bottom"
                >
                  <Sbutton
                    disabled={!(props.isEditModeActive)}
                    className="ms-2"
                    onClick={(e) => {
                      props.callBackFunction.performAccordionAction(
                        props.row,
                        'removeMapping'
                      );
                    }}
                  >
                    Delete
                  </Sbutton>
                </Tooltip>
              </>
              {/*              <Tooltip
                title={open ? 'Hide details' : 'Show details'}
                placement="bottom"
              >
                <IconButton
                  className="ms-2"
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
              </Tooltip>*/}
            </div>
          </>
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

  <div className='d-flex justify-content-between ps-1'>
        <h2 className="mb-0">Mappings</h2>
        <SearchWrapper>
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
      </div>
      <AccordionContainer component={Paper} className="gx-0">
        <Table aria-label="collapsible table w-100">
          <TableHead>
            <TableRow className="accordion-row row">
              <StyledTableCell className="col-4">
                <TableCellPadder>
                  <span className="fw-bold ps-3">Source</span>
                </TableCellPadder>
              </StyledTableCell>
              <StyledTableCell className="col-2">
                <TableCellPadder>
                  <span className="fw-bold">Mapping operations</span>
                </TableCellPadder>
              </StyledTableCell>
              <StyledTableTargetCell className="col-4">
                <span className="fw-bold">Target</span>
              </StyledTableTargetCell>
              <StyledTableActionsCell className="col-2 d-flex flex-row justify-content-end">
                <TableCellPadder>
                  <span className="fw-bold">Actions</span>
                </TableCellPadder>
              </StyledTableActionsCell>
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
                    rowcount={mappingData.length}
                    mappingFunctions={props.mappingFunctions}
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
      </AccordionContainer>
    </>
  );
}
