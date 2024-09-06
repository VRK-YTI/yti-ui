import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';

import {NodeMapping} from '@app/common/interfaces/crosswalk-connection.interface';
import {FunctionIcon,} from '@app/common/components/shared-icons';
import {
  IconCircleMid, IconLetterWrap, StooltipContainer,
} from '@app/modules/crosswalk-editor/mappings-accordion/mappings-accordion.styles';
import {Button as Sbutton, Heading, Text, Tooltip as Stooltip} from "suomifi-ui-components";
import {
  TooltipText
} from "@app/modules/crosswalk-editor/mappings-accordion/function-tooltip-box/function-tooltip-box.styles";

export default function FunctionTooltipBox(props: {
  row: NodeMapping;
  tooltipHoverText: string;
  tooltipHeading: string;
  isEditModeActive: boolean;
  callBackFunction: any;
  functionName: string,
  processingId: string,
  mappingFunctions: any[],
  alternateIconLetter?: string;
}) {
  const [hoverTooltipOpen, setHoverTooltipOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const tooltipClick = () => {
    setTooltipOpen(!tooltipOpen);
    setHoverTooltipOpen(false);
  };

  interface functionParam {
    key: string,
    value: any
  }

  function generateTexts() {

    let functionName = '';
    let functionDescription = '';
    let functionParams: functionParam[] = [] as functionParam[];
    if (props.functionName === 'predicate') {
      return (<>
        <TooltipText>{props.row.predicate}</TooltipText>
        <br/></>);
    } else if (props.functionName === 'mappingFunction') {
      const mappingFunction = props.mappingFunctions.filter(fnc => fnc.uri === props.processingId);
      if (mappingFunction.length > 0) {
        functionName = mappingFunction[0].name;
        functionDescription = mappingFunction[0].description;
      }
      return (<><p>{functionName}</p><p>{functionDescription}</p></>);
    } else if (props.functionName === 'sourceOperation' || 'targetOperation') {
      let node: any[] | undefined = [];
      if (props.functionName === 'sourceOperation') {
        node = props.row.source.filter(node => node.id === props.processingId);
      } else {
        node = props.row.target.filter(node => node.id === props.processingId);
      }

      if (props.mappingFunctions && node.length > 0) {
        const sourceOperation = props.mappingFunctions.filter(fnc => {
          return node && (fnc.uri === node[0]?.processing?.id);
        });
        if (node[0]?.processing?.params) {
          for (const [key, value] of Object.entries(node[0]?.processing?.params)) {
            if (key !== 'input') {
              functionParams.push({key: key, value: value})
            }
          }
        }
        functionName = sourceOperation[0].name;
        functionDescription = sourceOperation[0].description;
      }
      return (<><p>{functionName}</p><p>{functionDescription}</p>{functionParams.length > 0 ?
        <Heading variant="h5" as="h2">Parameters</Heading> : ''}{functionParams.map(param => <>
        <TooltipText>{param.key}: {param.value}</TooltipText>
      </>)}<br/></>);
    } else return '';
  }

  return (
    <>
      <Tooltip
        open={hoverTooltipOpen}
        onOpen={() => setHoverTooltipOpen(true)}
        onClose={() => setHoverTooltipOpen(false)}

        title={tooltipOpen ? 'Hide ' + props.tooltipHoverText + ' details' : 'Show ' + props.tooltipHoverText + ' details'}
        placement="bottom"
      >
        <IconCircleMid onClick={() => tooltipClick()}>
          {props.alternateIconLetter &&
              <IconLetterWrap>{props.alternateIconLetter}</IconLetterWrap>
          }
          {!props.alternateIconLetter &&
              <FunctionIcon></FunctionIcon>
          }
        </IconCircleMid>
      </Tooltip>
      <StooltipContainer>
        <Stooltip
          ariaToggleButtonLabelText='Toggle'
          ariaCloseButtonLabelText='Close'
          open={tooltipOpen}
          onCloseButtonClick={() => setTooltipOpen(false)}
        >
          <Heading variant="h5" as="h2">
            {props.tooltipHeading[0].toUpperCase() + props.tooltipHeading.slice(1)}
          </Heading>
          {tooltipOpen && generateTexts()}
          <Tooltip
            title={props.isEditModeActive ? 'Edit ' + props.tooltipHeading : 'Activate edit mode to edit ' + props.tooltipHeading}
            placement="bottom"
          ><span>
              <Sbutton
                disabled={!(props.isEditModeActive)}
                onClick={(e) => {
                  tooltipClick();
                  props.callBackFunction.performAccordionAction(
                    props.row,
                    'highlightFunctionField', props.processingId, props.functionName
                  );
                }}
              >
                Edit
              </Sbutton>
              </span>
          </Tooltip>
        </Stooltip>
      </StooltipContainer>
    </>
  );
}

