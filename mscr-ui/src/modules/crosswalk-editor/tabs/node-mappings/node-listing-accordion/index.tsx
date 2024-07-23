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
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {
  Button as Sbutton,
  Dropdown,
  DropdownItem,
  SearchInput,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckIcon from '@mui/icons-material/Check';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown';
import Tooltip from '@mui/material/Tooltip';

import {
  CrosswalkConnectionNew,
  NodeListingRow,
  NodeMapping
} from '@app/common/interfaces/crosswalk-connection.interface';
import {InfoIcon} from '@app/common/components/shared-icons';
import {useEffect, useState} from 'react';
import {useTranslation} from 'next-i18next';
import {SearchWrapper} from "@app/modules/crosswalk-editor/mappings-accordion/mappings-accordion.styles";
import {
  Button as SButton,
} from 'suomifi-ui-components';
import {getLanguageVersion} from "@app/common/utils/get-language-version";
import validateMapping from "@app/modules/crosswalk-editor/mapping-validator";

const StyledCollapse = styled(Collapse)({
  maxWidth: '277px'
});


const StyledTableCell = styled(TableCell)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  fontSize: '0.95rem'
});

const StyledTableHeadingCell = styled(TableCell)({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem'
});


const StyledTableButtonCell = styled(TableCell)({
  display: 'flex',
  justifyContent: 'end',
  flexDirection: 'row',
  div: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  button: {maxHeight: '36px'}
});

const StyledTableRow = styled(TableRow)(({theme}) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  maxWidth: '300px',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableFoldRow = styled(TableRow)(({theme}) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  maxWidth: '308px',
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledArrowCircleUp = styled(ArrowCircleUp)({
  fontSize: '1.4rem',
  color: '#3D6DB6',
  cursor: 'pointer',
  padding: '0px 12px 0px 15px'
});

const StyledArrowCircleDown = styled(ArrowCircleDown)({
  fontSize: '1.4rem',
  color: '#3D6DB6',
  cursor: 'pointer',
  padding: '0px 12px 0px 15px'
});


function Row(props: {
  row: NodeListingRow;
  mappingFunctions: any;
  showAttributeNames: boolean;
  sourceOperationValues: Array<any>;
  sourceProcessing: any;
  predicateOperationValues: [];
  index: number;
  callBackFunction: any;
  rowCount: number;
  isSourceAccordion: boolean;
  isOneToManyMapping: boolean;
}) {
  const [open, setOpen] = React.useState(props.rowCount < 2 && props.index === 0);
  const [sourceOperationValueFields, setSourceOperationValueFields] = useState<React.ReactFragment>();
  const [sourceOperationValue, setSourceOperationValue] = useState<string>('');
  const [originalValuesInit, setOriginalValuesInit] = useState<boolean>(false);

  if (!originalValuesInit) {
    setSourceOperationSelection(props.row?.sourceProcessingSelection, props.row.id);
    setOriginalValuesInit(true);
  }

  function deleteNodeFromMapping() {
    props.isSourceAccordion ? props.callBackFunction('deleteSourceNode', props.row.id) : props.callBackFunction('deleteTargetNode', props.row.id);
    setOpen(false);
  }

  function setSourceOperationSelection(operationKey: string | undefined, mappingId: string) {
    if (operationKey) {
      console.log('setting source operation', operationKey , mappingId);
      props.callBackFunction('updateSourceOperation', mappingId, '', operationKey);
      //setSourceOperationValue(operationKey);
      generateSourceOperationValueFields(operationKey, mappingId);
    }
  }

  function updateSourceOperationValue(mappingId: string, newValue: string, inputName: string) {
    setSourceOperationValue(newValue);
    props.callBackFunction('updateSourceOperationValue', mappingId, newValue, inputName)
  }

  function generateSourceOperationValueFields(operationKey: string | undefined, mappingId: string) {
    const inputFieldParams = props?.mappingFunctions.filter((fnc: { uri: string | undefined; }) => {
      return fnc.uri === operationKey;
    })[0].parameters;

    if (operationKey !== 'N/A') {
      setSourceOperationValueFields(
        inputFieldParams.map(input => {
          // If function has a default value, it's hidden form UI.
          if (!input.defaultValue) {
            const originalValue = getMappingFunctionOriginalValues(operationKey, input.name);
            setSourceOperationValue(originalValue);
            return (<div className='mt-2'><TextInput
              labelText={input.name}
              defaultValue={originalValue}
              //value={sourceOperationValue}
              onChange={(newValue) => updateSourceOperationValue(mappingId, newValue ? newValue.toString() : '', input.name)}
              visualPlaceholder="Operation value"
            /></div>)
          }
        }));
    }
  }

  function getMappingFunctionOriginalValues(operationKey: string, paramName: string) {
      if (props.row.sourceProcessing && props.row.sourceProcessing.id === operationKey) {
        // @ts-ignore
        return props.row.sourceProcessing.params[paramName];
      }
  };

  return (
    <>
      <StyledTableRow className="row">
        <StyledTableCell className="col-9 d-flex flex-row justify-content-start">

          <div
            className={props.rowCount > 1 ? 'd-flex flex-column justify-content-center' : 'd-flex flex-column justify-content-center d-none'}>
            <div>
              <Tooltip className={props.index !== 0 && props.isSourceAccordion ? '' : 'd-none'}
                       title={'Order node up'}
                       placement="left"
              >
                <StyledArrowCircleUp
                  onClick={() => props.callBackFunction('moveNodeUp', props.row.id)}></StyledArrowCircleUp>
              </Tooltip>
            </div>
            <div className={props.isSourceAccordion ? '' : 'ms-3'}>
              {props.index !== props.rowCount - 1 && props.rowCount > 1 && props.isSourceAccordion &&
                  <Tooltip
                      title={'Order node down'}
                      placement="left"
                  >
                      <StyledArrowCircleDown
                          onClick={() => props.callBackFunction('moveNodeDown', props.row.id)}></StyledArrowCircleDown>
                  </Tooltip>
              }
            </div>
          </div>

          <div
            className={props.rowCount > 1 ? 'd-flex flex-column justify-content-center' : 'd-flex flex-column justify-content-center ms-3'}>{props.row.name}</div>
        </StyledTableCell>

        <StyledTableButtonCell className="col-3 fw-bold">
          <div>
            <Tooltip
              title={open ? 'Hide details' : 'Show details'}
              placement="right"
            >
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={(e) => {
                  setOpen(!open);
                  e.stopPropagation();
                }}
              >
                {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
              </IconButton>
            </Tooltip>
          </div>
        </StyledTableButtonCell>
      </StyledTableRow>

      <StyledTableFoldRow>
        <TableCell className="d-flex flex-nowrap p-0">
          <StyledCollapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <div className="row">
              <div className="col-12">
                <div className="mx-3 mt-1 mb-2 d-flex flex-column">
                  <p>
                    <span className="fw-bold">Type: </span>
                    {props?.row?.type ?? ''}
                  </p>
                  <p>
                    <span className="fw-bold">Description: </span>
                    {props?.row?.description?.length > 0 ? props?.row?.description : 'N/A'}
                  </p>

                  {props.isSourceAccordion &&
                      <><Dropdown className='mt-2 node-info-dropdown'
                                  labelText="Source operation"
                                  visualPlaceholder="Operation not selected"
                                  defaultValue="Operation not selected"
                                  value={props.row?.sourceProcessingSelection}
                                  onChange={(newValue) => setSourceOperationSelection(newValue, props.row.id)}
                      >
                        {props?.mappingFunctions?.map((rt) => (
                          <DropdownItem key={rt.uri} value={rt.uri}>
                            {rt.name}
                          </DropdownItem>
                        ))}
                      </Dropdown>
                        {sourceOperationValueFields}
                      </>
                  }
                </div>
                <br/>
              </div>
              <div className='col-12 mt-4 d-flex flex-row gx-0 justify-content-end my-2'>
                <div className="d-flex flex-row">
                  {props.rowCount > 1 &&
                      <SButton className="align-self-end"
                               style={{height: 'min-content'}}
                               onClick={() => deleteNodeFromMapping()}
                               variant="secondaryNoBorder"
                      >
                        {'Remove node'}
                      </SButton>
                  }
                </div>
              </div>
            </div>
          </StyledCollapse>
        </TableCell>
      </StyledTableFoldRow>
    </>
  );
}

export default function NodeListingAccordion(props: any) {
  const {t} = useTranslation('common');
  const [nodeData, setNodeData] = React.useState<NodeListingRow[]>([]);
  const [showAttributeNames, setShowAttributeNames] = React.useState<boolean>(true);
  const [mappingFunctions, setMappingFunctions] = React.useState<any>([]);
  useEffect(() => {
    let newNodes: NodeListingRow[] = [];
    if (props.isSourceAccordion) {
      // Source
      if (props.isOneToManyMapping) {
        let newNode: NodeListingRow = {
          description: props.nodes[0].source.properties.description,
          sourceProcessingSelection: props.nodes[0].sourceProcessing?.id ?? '',
          sourceProcessing: props.nodes[0].sourceProcessing,
          type: props.nodes[0].source.properties.type,
          isSelected: false, notes: undefined, name: props.nodes[0].source.name, id: props.nodes[0].source.id
        }
        newNodes.push(newNode);
      } else {
        props.nodes.forEach((node: CrosswalkConnectionNew) => {
          let newNode: NodeListingRow = {
            description: node?.source.properties.description,
            sourceProcessingSelection: node?.sourceProcessing?.id ?? '',
            sourceProcessing: node?.sourceProcessing,
            type: node?.source.properties.type,
            isSelected: false, notes: undefined, name: node.source.name, id: node.source.id
          }
          newNodes.push(newNode);
        });
      }
    } else {
      // Target
      if (props.isOneToManyMapping) {
        props.nodes.forEach((node: CrosswalkConnectionNew) => {
          let newNode: NodeListingRow = {
            description: node?.target.properties.description,
            sourceProcessingSelection: node?.sourceProcessing?.id ?? '',
            sourceProcessing: node?.sourceProcessing,
            type: node?.target.properties.type,
            isSelected: false, notes: undefined, name: node.target.name, id: node.target.id
          }
          newNodes.push(newNode);
        });
      } else {
        let newNode: NodeListingRow = {
          description: props.nodes[0].target.properties.description,
          sourceProcessingSelection: props.nodes[0].sourceProcessing?.id ?? '',
          sourceProcessing: props.nodes[0].sourceProcessing,
          type: props.nodes[0].target.properties.type,
          isSelected: false, notes: undefined, name: props.nodes[0].target.name, id: props.nodes[0].target.id
        }
        newNodes.push(newNode);
      }
    }
    setNodeData(newNodes);
    setShowAttributeNames(props.showAttributeNames);
    if (props?.mappingFunctions) {
      const emptyDefaultValue = {name: '', uri: 'N/A'}
      setMappingFunctions([emptyDefaultValue, ...props.mappingFunctions]);
    }
  }, [props]);

  return (
    <>
      <TableContainer component={Paper} className="gx-0">
        <Table aria-label="collapsible table w-100">
          <TableHead className="gx-0">
            <TableRow className="row gx-0">
              <StyledTableHeadingCell className="col-12 bg-light-blue">
                <span
                  className="fw-bold ps-3">{props.isSourceAccordion ? props.isOneToManyMapping ? 'Source' : 'Sources' : props.isOneToManyMapping ? 'Targets' : 'Target'}</span>
              </StyledTableHeadingCell>
            </TableRow>
          </TableHead>

          {nodeData?.length > 0 && (
            <TableBody>
              {nodeData.map((row: NodeListingRow, index) => {
                return (
                  <Row
                    key={index}
                    index={index}
                    row={row}
                    callBackFunction={props.accordionCallbackFunction}
                    showAttributeNames={showAttributeNames}
                    mappingFunctions={mappingFunctions}
                    predicateOperationValues={props.predicateOperationValues}
                    sourceOperationValues={props.sourceOperationValues}
                    sourceProcessing={props.sourceProcessing}
                    rowCount={nodeData.length}
                    isSourceAccordion={props.isSourceAccordion}
                    isOneToManyMapping={props.isOneToManyMapping}
                  />
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  );
}
