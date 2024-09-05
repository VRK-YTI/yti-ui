import {CrosswalkConnectionNew, NodeMapping} from '@app/common/interfaces/crosswalk-connection.interface';
import {InlineAlert} from "suomifi-ui-components";
import {useState} from 'react';
import {IconClose, IconMenu} from 'suomifi-icons';
import styled from 'styled-components';
import Tooltip from '@mui/material/Tooltip';

export const StyledInlineAlert = styled(InlineAlert)`
  margin-bottom: 20px;

  .fi-inline-alert_label {
    font-size: 16px !important;
    font-weight: normal;
    line-height: 1.5rem;
  }

  .anchorlink {
    text-decoration: underline;
    cursor: pointer;
  }

  .fi-icon {
    cursor: pointer;
  }
`;

function getMappingFunctionIOFormats(functionId: string, mappingFunctions: any) {
  let IOFormats = {input: '', output: ''}

  const functions = mappingFunctions.filter((item: any) => item.uri === functionId);
  functions[0].parameters.map((param: { name: string; datatype: any; }) => {
    if (param?.name === 'input' && param?.datatype) {
      IOFormats.input = param.datatype;
    }
  });
  if (functions[0]?.outputs) {
    functions[0]?.outputs[0]?.datatype ? IOFormats.output = functions[0]?.outputs[0]?.datatype : undefined;
  }
  return IOFormats;
}

export function validateMappings(mappingNodes: CrosswalkConnectionNew[], mappingFunctions: any) {
  let errorMessages: string[] = [];
  mappingNodes.forEach(node => {
    if (node.sourceProcessing) {
      // Source has source processing function
      const sourceProcessingIOFormats = getMappingFunctionIOFormats(node.sourceProcessing.id, mappingFunctions);
      if (node.source.properties.type !== sourceProcessingIOFormats.input) {
        errorMessages.push('Datatype mismatch: ' + node.source.name + ': ' + node.source.properties.type + ' -> ' + node.sourceProcessing.id + ': ' + sourceProcessingIOFormats.input);
      }
      if (node?.processing) {
        // Mapping operation is present
        const mappingFncIOFormats = getMappingFunctionIOFormats(node.processing.id, mappingFunctions);
        if (sourceProcessingIOFormats.output !== mappingFncIOFormats.input) {
          errorMessages.push('Datatype mismatch: ' + node.sourceProcessing.id + ': ' + sourceProcessingIOFormats.output + ' -> ' + node.processing.id + ': ' + mappingFncIOFormats.input);
        }
        if (node.target.properties.type !== mappingFncIOFormats.output) {
          errorMessages.push('Datatype mismatch: ' + node.processing.id + ': ' + mappingFncIOFormats.output + ' -> ' + node.target.name + ': ' + node.target.properties.type);
        }
      } else {
        // Source has source processing and no mapping operation
        if (sourceProcessingIOFormats.output !== node.target.properties.type) {
          errorMessages.push('Datatype mismatch: ' + node.sourceProcessing.id + ': ' + sourceProcessingIOFormats.output + ' -> ' + node.target.name + ': ' + node.target.properties.type);
        }
      }

    } else {
      // Source has no source processing function
      if (node?.processing) {
        // Mapping operation is present
        const mappingFncIOFormats = getMappingFunctionIOFormats(node?.processing?.id, mappingFunctions);
        if (node.source.properties.type !== mappingFncIOFormats.input) {
          errorMessages.push('Datatype mismatch: ' + node.source.name + ': ' + node.source.properties.type + ' -> ' + node.processing.id + ': ' + mappingFncIOFormats.input);
        }
        if (node.target.properties.type !== mappingFncIOFormats.output) {
          errorMessages.push('Datatype mismatch: ' + node.processing.id + ': ' + mappingFncIOFormats.output + ' -> ' + node.target.name + ': ' + node.target.properties.type);
        }
      } else {
        // Source has no source processing function and no mapping operation
        if (node.source.properties.type !== node.target.properties.type) {
          errorMessages.push('Datatype mismatch: ' + node.source.name + ': ' + node.source.properties.type + ' -> ' + node.target.name + ': ' + node.target.properties.type);
        }
      }
    }
  });
  return errorMessages;
}

export default function ValidationErrorBar(props: {
  mappingNodes: CrosswalkConnectionNew[] | undefined;
  mappingFunctions: any;
  hideErrorBarCallback: any;
}) {
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  function getErrorCaption(validationErrors: string[]) {
    return (<div className='d-flex justify-content-between font-weight-normal'>
      <div className=''>{validationErrors.length} datatype validation warnings</div>
      <div className='d-flex justify-content-end'>
        <div className='anchorlink me-4'
             onClick={() => setIsDetailsVisible(!isDetailsVisible)}>{isDetailsVisible ? 'hide details' : 'show details'}</div>
        <Tooltip
          title='Click to dismiss'
          placement="bottom"
        >
          <div className='me-1 d-flex flex-column justify-content-center'>
            <IconClose onClick={() => props.hideErrorBarCallback('hideErrorBar')}></IconClose>
          </div>
        </Tooltip>
      </div>
    </div>);
  }

  let validationErrors: string[] = [];
  if (props.mappingNodes) {
    validationErrors = validateMappings(props.mappingNodes, props.mappingFunctions);
  }
  return (<>
      <div className='mb-2'>
        {validationErrors.length > 0 &&
            <StyledInlineAlert className={'mt-3'} status="warning" labelText={getErrorCaption(validationErrors)}>
              {isDetailsVisible &&
                  <ul>
                    {validationErrors.map((error, idx) => (
                      <li key={`validation-error-${idx}`}>{error}</li>
                    ))}
                  </ul>
              }
            </StyledInlineAlert>
        }
      </div>
    </>
  );
}