import { RenderTree } from '@app/common/interfaces/crosswalk-connection.interface';
import { Dropdown, DropdownItem, ToggleButton } from 'suomifi-ui-components';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { InfoIcon } from '@app/common/components/shared-icons';
import { useTranslation } from 'next-i18next';
import { DropdownWrapper } from '@app/common/components/schema-info/schema-info.styles';
import TypeSelector from '@app/common/components/schema-info/schema-tree/node-info/type-selector';
import { IconLinkExternal } from 'suomifi-icons';

export default function NodeInfo(props: {
  treeData: RenderTree[];
  dataIsLoaded: boolean;
  isNodeEditable?: boolean;
}) {
  const { t } = useTranslation('common');
  const [selectedNode, setSelectedNode] = useState<RenderTree>();
  const [nodeAttributes, setNodeAttributes] = useState<ConstantAttribute[]>([]);
  const isLeafNode = selectedNode?.children.length === 0;
  const [dropDownList, setDropDownList] = useState<RenderTree[]>([]);
  const [nodeTypeAttribute, setNodeTypeAttribute] = useState('');

  useEffect(() => {
    if (props.treeData && props.treeData.length > 0) {
      setDropDownList(props.treeData);
      setSelectedNode(props.treeData[0]);
    } else {
      setSelectedNode(undefined);
    }
  }, [props.treeData]);

  const handleDropDownSelect = (nodeId: string) => {
    const newSelectedNode = props.treeData.find((item) => item.id === nodeId);
    setSelectedNode(newSelectedNode ?? selectedNode);
  };

  interface ConstantAttribute {
    name: string;
    value: string | undefined;
  }

  useEffect(() => {
    if (selectedNode && selectedNode.properties) {
      const nodeProperties: ConstantAttribute[] = [];
      for (const [key, value] of Object.entries(selectedNode.properties)) {
        if (key === '@type' && isLeafNode && props.isNodeEditable) {
          setNodeTypeAttribute(value as string);
          continue;
        }
        nodeProperties.push({
          name: key,
          value: typeof value === 'string' ? value.toString() : undefined,
        });
      }
      setNodeAttributes(nodeProperties);
    }
  }, [isLeafNode, props.isNodeEditable, selectedNode]);

  function processHtmlLinks(input: string | undefined) {
    if (input && (input.startsWith('http://') || input.startsWith('https://'))) {
      return (
        <a href={input} target="_blank" rel="noreferrer">
          {input} <IconLinkExternal />
        </a>
      );
    }
    return input;
  }

  return (
    <div className="row d-flex justify-content-between node-info-box">
      <h3>{t('node-info.selected-node-info')}</h3>
      <div className="col flex-column d-flex justify-content-between side-bar-wrap">
        <div className="mb-2"></div>
        <Box
          className="bg-wrap"
          sx={{
            height: 440,
            flexGrow: 1,
            maxWidth: 400,
            overflowY: 'auto',
          }}
        >
          {props.treeData.length < 1 && (
            <>
              <div className="row gx-1">
                <div className="col-2 d-flex">
                  <div className="pt-1 ms-1">
                    <InfoIcon></InfoIcon>
                  </div>
                </div>
                <div className="col-10 d-flex align-self-center">
                  {!props.dataIsLoaded && <div>{t('node-info.loading')}</div>}
                  {props.dataIsLoaded && (
                    <div>{t('node-info.select-a-node')}</div>
                  )}
                </div>
              </div>
            </>
          )}
          {dropDownList.length > 1 && (
            <DropdownWrapper>
              <Dropdown
                labelText={t('schema-tree.dropdown-label')}
                labelMode={'hidden'}
                className="mt-2"
                visualPlaceholder={t('schema-tree.dropdown-placeholder')}
                value={selectedNode?.id ?? ''}
                onChange={(newValue) => handleDropDownSelect(newValue)}
              >
                {dropDownList.map((rt) => (
                  <DropdownItem key={rt.visualTreeId} value={rt.id}>
                    {rt.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            </DropdownWrapper>
          )}
          <div>
            <div className="row">
              {props.treeData.length > 1 && (
                <>
                  <div className="col-12">
                    <div>{t('schema-tree.selected-node')}</div>
                    <div className="attribute-font">{selectedNode?.name}</div>
                  </div>
                </>
              )}

              {nodeAttributes.map((attrib) => (
                <div className="col-12" key={self.crypto.randomUUID()}>
                  <div className="">{processHtmlLinks(attrib.name)}:</div>
                  <div className="attribute-font">
                    {processHtmlLinks(attrib.value)}
                  </div>
                </div>
              ))}
              {props.isNodeEditable &&
                isLeafNode &&
                nodeTypeAttribute !== '' && (
                  <div className="col-12" key={self.crypto.randomUUID()}>
                    <div className="">@type:</div>
                    <div className="attribute-font">
                      {processHtmlLinks(nodeTypeAttribute)}
                    </div>
                    <TypeSelector nodeId={selectedNode?.id} />
                  </div>
                )}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}
