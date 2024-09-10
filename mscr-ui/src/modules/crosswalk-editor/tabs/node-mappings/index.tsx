import {
  CrosswalkConnectionNew,
  NodeMapping,
} from '@app/common/interfaces/crosswalk-connection.interface';
import ValidationErrorBar from '@app/modules/crosswalk-editor/mapping-validator';
import {Dropdown, IconPlus, InlineAlert, Textarea, TextInput} from 'suomifi-ui-components';
import {DropdownItem} from 'suomifi-ui-components';
import {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from 'suomifi-ui-components';
import NodeListingAccordion from "@app/modules/crosswalk-editor/tabs/node-mappings/node-listing-accordion";
import {MidColumnWrapper} from "@app/modules/crosswalk-editor/tabs/node-mappings/node-mappings.styles";
import {cloneDeep} from 'lodash';
import {useRef} from 'react';
import {highlightOperation} from "@app/modules/crosswalk-editor/mappings-accordion";

interface mappingOperationValue {
  operationId: string;
  parameterId: string;
  value: string;
}

export default function NodeMappings(props: {
  nodeSelections: CrosswalkConnectionNew[];
  performMappingsModalAction: any;
  mappingFilters: any;
  mappingFunctions: any;
  modalOpen: boolean;
  isPatchMappingOperation: boolean;
  isOneToManyMapping: boolean;
  highlightOperation: highlightOperation | undefined;
}) {
  const EXACT_MATCH_DROPDOWN_DEFAULT = 'http://www.w3.org/2004/02/skos/core#exactMatch';

  let sourceSelectionInit = '';
  let targetSelectionInit = '';

  const predicateValues = [
    {
      name: 'Broad match',
      id: 'http://www.w3.org/2004/02/skos/core#broadMatch',
    },
    {
      name: 'Broader',
      id: 'http://www.w3.org/2004/02/skos/core#broader',
    },
    {
      name: 'Broader transitive',
      id: 'http://www.w3.org/2004/02/skos/core#broaderTransitive',
    },
    {
      name: 'Close match',
      id: 'http://www.w3.org/2004/02/skos/core#closeMatch',
    },
    {
      name: 'Exact match',
      id: 'http://www.w3.org/2004/02/skos/core#exactMatch',
    },
    {
      name: 'Narrow match',
      id: 'http://www.w3.org/2004/02/skos/core#narrowMatch',
    },
    {
      name: 'Narrower',
      id: 'http://www.w3.org/2004/02/skos/core#narrower',
    },
    {
      name: 'Narrower transitive',
      id: 'http://www.w3.org/2004/02/skos/core#narrowerTransitive',
    },
    {
      name: 'Related',
      id: 'http://www.w3.org/2004/02/skos/core#related',
    },
    {
      name: 'Related match',
      id: 'http://www.w3.org/2004/02/skos/core#relatedMatch',
    },
  ];

  useEffect(() => {
    for (let i = 0; i < props.nodeSelections.length; i += 1) {
      if (props?.nodeSelections[i]?.source) {
        sourceSelectionInit = props.nodeSelections[i].source.id;
      }
      if (props?.nodeSelections[i]?.target) {
        targetSelectionInit = props.nodeSelections[i].target.id;
      }
    }
    if (props?.nodeSelections[0]?.notes) {
      setNotesValue(props.nodeSelections[0].notes);
    }
    if (props?.nodeSelections[0]?.predicate) {
      setPredicateValue(props.nodeSelections[0].predicate);
    }
    if (props?.nodeSelections[0]?.processing) {
      setMappingOperationSelection(props.nodeSelections[0].processing.id);
      setMappingOperationFormatted(props.nodeSelections[0].processing);
    }

    if (!props?.isPatchMappingOperation) {
      setPredicateValue(EXACT_MATCH_DROPDOWN_DEFAULT);
    }
    if (props?.mappingFunctions) {
      const emptyDefaultValue = {name: '', uri: 'N/A'}
      setMappingFunctions([emptyDefaultValue, ...props.mappingFunctions]);
    }

    setVisible(props?.modalOpen);
    setIsErrorBarVisible(true);
    setMappingNodes(props?.nodeSelections);
    setHighlightOperation(props.highlightOperation);
  }, [props]);

  const [isMappingOperationValuesInit, setMappingOperationValuesInit] = useState<boolean>(false);
  const [isErrorBarVisible, setIsErrorBarVisible] = useState<boolean>(true);
  const [mappingOperationValues, setMappingOperationValues] = useState<mappingOperationValue[] | undefined>(undefined);
  const [mappingOperationSelection, setMappingOperationSelection] = useState<string | undefined>(undefined);
  const [mappingOperationFormatted, setMappingOperationFormatted] = useState([] as any);
  const [mappingFunctions, setMappingFunctions] = useState([] as any);
  const [predicateValue, setPredicateValue] = useState<string>(
    EXACT_MATCH_DROPDOWN_DEFAULT,
  );

  const [sourceOperationValueErrors, setOperationValueErrors] = useState<any[]>([] as any);

  const [visible, setVisible] = useState(props.modalOpen);
  const [mappingNodes, setMappingNodes] = useState<CrosswalkConnectionNew[] | undefined>(undefined);

  const [notesValue, setNotesValue] = useState<string>('');
  const mappingPayloadInit: NodeMapping = {
    predicate: '',
    source: [],
    target: [],
  };
  const [highlightOperation, setHighlightOperation] = useState<highlightOperation | undefined>(undefined);

  function generateSaveMappingPayload() {
    let mappings = mappingPayloadInit;
    if (mappingNodes) {
      mappings.source.push({
        id: mappingNodes[0].source.id,
        label: mappingNodes[0].source.name,
        uri: mappingNodes[0].source.uri,
        processing: mappingNodes[0].sourceProcessing ? mappingNodes[0].sourceProcessing : undefined
      });
      mappings.target.push({
          id: mappingNodes[0].target.id,
          label: mappingNodes[0].target.name,
          uri: mappingNodes[0].target.uri,
          processing: mappingNodes[0].targetProcessing ? mappingNodes[0].targetProcessing : undefined
        }
      );

      if (props.isOneToManyMapping) {
        // Merge targets into single source for one to many mapping
        for (let i = 0; i < props.nodeSelections.length; i += 1) {
          if (i < mappingNodes.length - 1 && (mappingNodes[i].source.id === mappingNodes[i + 1].source.id)) {
            mappings.target.push({
              id: mappingNodes[i + 1].target.id,
              label: mappingNodes[i + 1].target.name,
              uri: mappingNodes[i + 1].target.uri,
              processing: mappingNodes[i + 1].targetProcessing ? mappingNodes[i + 1].targetProcessing : undefined
            });
          }
        }
      } else {
        // Merge sources into single target for many to one mapping
        for (let i = 0; i < props.nodeSelections.length; i += 1) {
          if (i < mappingNodes.length - 1 && (mappingNodes[i].target.id === mappingNodes[i + 1].target.id)) {
            mappings.source.push({
              id: mappingNodes[i + 1].source.id,
              label: mappingNodes[i + 1].source.name,
              uri: mappingNodes[i + 1].source.uri,
              processing: mappingNodes[i + 1].sourceProcessing ? mappingNodes[i + 1].sourceProcessing : undefined
            });
          }
        }
      }
    }

    mappings.predicate = predicateValue ? predicateValue : '0';
    mappings.notes = notesValue;

    if (mappingOperationSelection) {
      mappings.processing = mappingOperationFormatted;
    }
    return mappings;
  }

  function closeModal() {
    setNotesValue('');
    props.performMappingsModalAction('closeModal', null, null);
  }

  function save() {
    if (props.isPatchMappingOperation) {
      props.performMappingsModalAction(
        'save',
        generateSaveMappingPayload(),
        props.nodeSelections[0].id,
      );
    } else {
      props.performMappingsModalAction('addMapping', generateSaveMappingPayload());
    }
    setNotesValue('');
  }

// CLEAR FIELDS WHEN MODAL OPENED
  useEffect(() => {
    setMappingOperationSelection(undefined);
    setOperationValueErrors([]);
  }, [visible]);

  const onPredicateRefChange = useCallback(node => {
    if (node !== null && props.highlightOperation && props.highlightOperation.operationId === 'predicate') {
      node.focus();
    }
  }, [props]);

  const onMappingFunctionRefChange = useCallback(node => {
    if (node !== null && props.highlightOperation && props.highlightOperation.operationId === 'mappingFunction') {
      node.focus();
    }
  }, [props]);

  function accordionCallbackFunction(isSourceNode: boolean, action: string, mappingId: any, operationValue: any, operationName: any, mappingOperationKey: any) {
    if (mappingNodes) {
      if (action === 'moveNodeUp' && mappingNodes.length > 1) {
        let sourceNodesNew = [...mappingNodes];
        for (let i = 0; i < mappingNodes.length; i += 1) {
          if (mappingNodes[i].source.id === mappingId) {
            let first = mappingNodes[i - 1];
            let second = mappingNodes[i];
            sourceNodesNew[i - 1] = second;
            sourceNodesNew[i] = first;
            setMappingNodes(sourceNodesNew);
          }
        }
      } else if (action === 'moveNodeDown' && mappingNodes.length > 1) {
        let sourceNodesNew = [...mappingNodes];
        for (let i = 0; i < mappingNodes.length; i += 1) {
          if (mappingNodes[i].source.id === mappingId) {
            let first = mappingNodes[i];
            let second = mappingNodes[i + 1];
            sourceNodesNew[i] = second;
            sourceNodesNew[i + 1] = first;
            setMappingNodes(sourceNodesNew);
          }
        }
      } else if (action === 'deleteNode' && mappingNodes.length > 1) {
        let newNodeSelections = mappingNodes.filter(node => {
          return isSourceNode ? (node.source.id !== mappingId) : (node.target.id !== mappingId);
        });
        setMappingNodes(newNodeSelections);
      } else {
        let mappingNodesCopy = cloneDeep(mappingNodes);

        let newNodeSelections = mappingNodesCopy.map(node => {
          if ((isSourceNode && (node.source.id === mappingId)) || (!isSourceNode && node.target.id === mappingId)) {
            if (action === 'setMappingParameterDefaults') {
              if (isSourceNode){
                node.sourceProcessing = mappingOperationKey;
              } else {
                node.targetProcessing = mappingOperationKey;
              }
            }
            if (action === 'updateOperation') {
              const originalParams = getMappingFunctionParams(mappingOperationKey);
              let formattedParams: any = {};
              if (originalParams) {
                originalParams.forEach((param: { name: any; defaultValue: any; }) => {
                  formattedParams[param.name] = param.defaultValue ? param.defaultValue : '';
                });
              }

              let processing: any = {
                id: mappingOperationKey,
                params: formattedParams,
              };
              mappingOperationKey !== 'N/A' ? (isSourceNode ? node.sourceProcessing = processing : node.targetProcessing = processing) : (isSourceNode ? node.sourceProcessing = undefined : node.targetProcessing = undefined);
              const params = getMappingFunctionParams(mappingOperationKey);

              if (params) {
                params.forEach(param => {
                  updateValidationErrors(isSourceNode ? 'sourceOperation' : 'targetOperation', mappingId, mappingOperationKey, param.name, param.defaultValue ? param.defaultValue : '');
                });
              } else {
                const filteredErrors = (sourceOperationValueErrors
                  .filter(
                    obj => obj.operationType !== 'sourceOperation'
                  ));
                setOperationValueErrors(filteredErrors);
              }
            }

            if (action === 'updateOperationValue') {
              updateValidationErrors(isSourceNode ? 'sourceOperation' : 'targetOperation', mappingId, mappingOperationKey, operationName, operationValue);
              if ((isSourceNode && node.sourceProcessing) || (!isSourceNode && node.targetProcessing)) {
                if (isSourceNode) {
                  // @ts-ignore
                  node.sourceProcessing.params[operationName] = operationValue;
                } else {
                  // @ts-ignore
                  node.targetProcessing.params[operationName] = operationValue;
                }
              } else {
                const originalParams = getMappingFunctionParams(operationName);
                let formattedParams: any = {};
                if (originalParams) {
                  originalParams.forEach((param: { name: string; defaultValue: string }) => {
                    formattedParams[param.name] = param.defaultValue ? param.defaultValue : '';
                  });
                }
                formattedParams[operationName] = operationValue;
                let processing: any = {
                  id: mappingOperationKey,
                  params: formattedParams,
                };
                if (isSourceNode) {
                  operationName !== 'N/A' ? node.sourceProcessing = processing : node.sourceProcessing = undefined;
                } else {
                  operationName !== 'N/A' ? node.targetProcessing = processing : node.targetProcessing = undefined;
                }
              }
            }
          }
          return node
        });
        setMappingNodes(newNodeSelections);
      }
    }
  }

  function updateValidationErrors(operationType: string, mappingId: string, mappingOperationKey: string, operationName: string, operationValue: string) {
    const originalParams = getMappingFunctionParams(mappingOperationKey);

    if (originalParams.find(item => item.name === operationName && item.required === true)) {
      const index = sourceOperationValueErrors
        .findIndex(
          obj => obj.operationType === operationType && obj.mappingId === mappingId && obj.mappingOperationKey === mappingOperationKey &&
            obj.operationName === operationName
        );

      if (operationValue && operationValue.length < 1) {

        // has error, add it if it doesn't exist
        if (index === -1) {
          const error = {
            operationType: operationType,
            mappingId: mappingId,
            mappingOperationKey: mappingOperationKey,
            operationName: operationName
          };
          const test = [error, ...sourceOperationValueErrors];
          setOperationValueErrors([error, ...sourceOperationValueErrors]);
        }
      } else {
        // has no error, remove possible old one
        const removalIndex = sourceOperationValueErrors
          .findIndex(
            obj => obj.mappingId === mappingId && obj.mappingOperationKey === mappingOperationKey &&
              obj.operationName === operationName
          );
        if (index !== -1) {
          let errorsTemp = [...sourceOperationValueErrors];
          errorsTemp.splice(removalIndex, 1);
          setOperationValueErrors(cloneDeep(errorsTemp));
        }
      }
    }
  }

  // Used by source nodes
  function getMappingFunctionParams(operationKey: string) {
    const functions = props.mappingFunctions.filter((item: any) => item.uri === operationKey
    ).map((fnc: { parameters: any; }) => {
      return fnc?.parameters;
    });
    return functions[0];
  }

  function generateMappingFunctionDefaultParams(operationKey: string) {
    const originalParams = props?.mappingFunctions.filter((fnc: { uri: string | undefined; }) => {
      return fnc.uri === operationKey;
    })[0].parameters;
    let formattedParams: any = {};
    if (originalParams) {
      originalParams.map((param: { name: any; defaultValue: any; }) => {
        formattedParams[param.name] = param?.defaultValue ? param?.defaultValue : '';
      });
    }
    return formattedParams;
  }

  function updateMappingOperationSelection(operationKey: string) {
    setMappingOperationValuesInit(false);
    setMappingOperationSelection(operationKey);
    const filteredErrors = (sourceOperationValueErrors
      .filter(
        obj => obj.operationType !== 'mappingOperation'
      ));
    setOperationValueErrors(filteredErrors);

    if (operationKey && operationKey.length > 0 && operationKey !== 'N/A') {
      const processing: any = {
        id: operationKey,
        params: generateMappingFunctionDefaultParams(operationKey),
      };
      setMappingOperationFormatted(processing);
    } else {
      setMappingOperationFormatted(undefined);
    }

    const params = getMappingFunctionParams(operationKey);
    if (params) {
      params.forEach(param => {
        updateValidationErrors('mappingOperation', '', operationKey, param.name, param.defaultValue ? param.defaultValue : '');
      });
    } else {
    }
  }

  function updateMappingOperationValue(operationKey: string, parameter: string, newValue: string) {
    setMappingOperationSelection(operationKey);

    if (mappingOperationValues) {
      const newValues = mappingOperationValues.map(operation => {
        if (operation.parameterId === parameter && operation.operationId === operationKey) {
          operation.value = newValue;
          operation.operationId = operationKey;
        }
        return operation;
      });
      setMappingOperationValues(newValues);
    } else {
      const operations: mappingOperationValue[] = [];
      operations.push({operationId: operationKey, parameterId: parameter, value: newValue});
      setMappingOperationValues(operations);
    }

    let formattedParams = generateMappingFunctionDefaultParams(operationKey);
    formattedParams[parameter] = newValue;
    let processing: any = {
      id: operationKey,
      params: formattedParams,
    };
    setMappingOperationFormatted(processing);
    setMappingOperationValuesInit(true);
    updateValidationErrors('mappingOperation', '', operationKey, parameter, newValue);
  }

  function getMappingOperationValue(operationKey: string, parameterName: string) {
    if (props?.nodeSelections[0]?.processing) {
      return props?.nodeSelections[0]?.processing.params[parameterName];
    } else return '';
  }

  function isMappingOperationValueValid(parameterName: string) {

    let ret = false;
    if (mappingOperationValues) {
      mappingOperationValues.filter(x => x.parameterId === parameterName).map(x => {
          if (x.value) {
            ret = x.value.length > 0;
          }
        }
      );
      return ret;
    }
  }

  function generateMappingOperationFields(operationKey: string | undefined) {
    let ret: JSX.Element[] = [];
    if (operationKey && operationKey.length > 0 && operationKey !== 'N/A') {
      const mappingFunctionWithParams = props?.mappingFunctions.filter((fnc: { uri: string | undefined; }) => {
        return fnc.uri === operationKey;
      });

      mappingFunctionWithParams[0].parameters.forEach(parameter => {
        if (operationKey && operationKey !== 'N/A') {
          if (!parameter.defaultValue) {
            if (!isMappingOperationValuesInit) {
              updateMappingOperationValue(operationKey, parameter.name, getMappingOperationValue(operationKey, parameter.name));
            }
            ret.push(<div className='mt-2'><TextInput
              labelText={parameter.name}
              defaultValue={getMappingOperationValue(operationKey, parameter.name)}
              onChange={(newValue) => updateMappingOperationValue(operationKey, parameter.name, newValue ? newValue.toString() : '')}
              visualPlaceholder="Operation value"
              status={isMappingOperationValueValid(parameter.name) ? 'default' : 'error'}
              required={parameter.required}
            /></div>);
          }
        }
      });
      return ret;
    } else return '';
  }

  return (
    <>
      <Modal
        appElementId="__next"
        visible={visible}
        onEscKeyDown={() => closeModal()}
        className="row bg-white edit-mapping-modal"
      >
        <ModalContent className="edit-mapping-modal-content">
          <ModalTitle>{props.isPatchMappingOperation ? 'Edit mapping' : 'Add mapping'}</ModalTitle>
          {false && isErrorBarVisible &&
              <ValidationErrorBar hideErrorBarCallback={() => setIsErrorBarVisible(false)}
                                  mappingNodes={mappingNodes}
                                  mappingFunctions={props.mappingFunctions}></ValidationErrorBar>
          }
          <div className="col flex-column d-flex justify-content-between">
            <div className="row bg-white">
              {/* SOURCE OPERATIONS */}
              <div className="col-4">
                <NodeListingAccordion nodes={mappingNodes} mappingFunctions={props.mappingFunctions}
                                      predicateOperationValues={predicateValues}
                                      accordionCallbackFunction={accordionCallbackFunction}
                                      isSourceAccordion={true}
                                      isOneToManyMapping={props.isOneToManyMapping}
                                      highlightOperation={highlightOperation} showAttributeNames={false}>
                </NodeListingAccordion>
              </div>

              {/* MID COLUMN */}
              <div className="col-4 d-flex flex-column bg-light-blue">
                <MidColumnWrapper>
                  <div><Dropdown className='mt-2 node-info-dropdown'
                                 labelText="Mapping operation"
                                 ref={onMappingFunctionRefChange}
                                 visualPlaceholder="Operation not selected"
                                 value={mappingOperationSelection ? mappingOperationSelection : props.nodeSelections[0]?.processing?.id}
                                 onChange={(newValue) => updateMappingOperationSelection(newValue)}
                  >
                    {mappingFunctions?.map((rt) => (
                      <DropdownItem key={rt.uri} value={rt.uri}>
                        {rt.name}
                      </DropdownItem>
                    ))}
                  </Dropdown></div>
                  {generateMappingOperationFields(mappingOperationSelection ? mappingOperationSelection : props.nodeSelections[0]?.processing?.id)}

                  <div>
                    <br/>
                    <Dropdown
                      className="mt-2 mb-4 node-info-dropdown"
                      labelText="Predicate"
                      visualPlaceholder="Exact match"
                      value={predicateValue}
                      ref={onPredicateRefChange}
                      autoFocus
                      //defaultValue={mappingNodes ? mappingNodes[0].predicate : ''}
                      onChange={(newValue) => {
                        setPredicateValue(newValue)
                      }
                      }
                    >
                      {predicateValues.map((rt) => (
                        <DropdownItem key={rt.id} value={rt.id}>
                          {rt.name}
                        </DropdownItem>
                      ))}
                    </Dropdown>

                  </div>
                  <Textarea
                    onChange={(event) => setNotesValue(event.target.value)}
                    labelText="Notes"
                    visualPlaceholder="No notes set. Add free form notes here."
                    value={notesValue}
                  />
                  <br/>
                </MidColumnWrapper>
              </div>

              {/* TARGET OPERATIONS */}
              <div className="col-4">
                <NodeListingAccordion nodes={mappingNodes} mappingFunctions={props.mappingFunctions}
                                      predicateOperationValues={predicateValues}
                                      accordionCallbackFunction={accordionCallbackFunction}
                                      isSourceAccordion={false}
                                      isOneToManyMapping={props.isOneToManyMapping}
                                      highlightOperation={highlightOperation}
                                      showAttributeNames={false}
                ></NodeListingAccordion>
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button disabled={sourceOperationValueErrors.length > 0} style={{height: 'min-content'}}
                  onClick={() => save()}>
            {'Save'}
          </Button>
          <Button
            style={{height: 'min-content'}}
            variant="secondary"
            onClick={() => closeModal()}
          >
            {'Cancel'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
