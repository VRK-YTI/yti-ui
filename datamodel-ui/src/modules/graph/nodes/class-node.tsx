/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  resetHighlighted,
  resetHovered,
  selectClassView,
  selectDisplayLang,
  selectHovered,
  selectModelTools,
  selectSelected,
  setAddResourceRestrictionToClass,
  setHighlighted,
  setHovered,
  setSelected,
  setUpdateClassData,
  setUpdateVisualization,
} from '@app/common/components/model/model.slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position, useReactFlow } from 'reactflow';
import {
  ActionMenu,
  ActionMenuItem,
  IconPlus,
  IconRows,
  IconSwapVertical,
} from 'suomifi-ui-components';
import { ClassNodeDiv, Resource } from './node.styles';
import { useStoreDispatch } from '@app/store';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import HasPermission from '@app/common/utils/has-permission';
import { useAddPropertyReferenceMutation } from '@app/common/components/class/class.slice';
import getConnectedElements from '../utils/get-connected-elements';
import { UriData } from '@app/common/interfaces/uri.interface';
import { ClassNodeDataType } from '@app/common/interfaces/graph.interface';
import useSetView from '@app/common/utils/hooks/use-set-view';
import { initializeResource } from '@app/common/components/resource/resource.slice';
import styled from 'styled-components';
import ResourceModal from '@app/modules/class-view/resource-modal';
import { translateResourceAddition } from '@app/common/utils/translation-helpers';
import { getSlugAsString } from '@app/common/utils/parse-slug';
import { useRouter } from 'next/router';

interface ClassNodeProps {
  id: string;
  data: ClassNodeDataType;
  selected: boolean;
}

const NodeActionsMenu = styled(ActionMenu)`
  background: white;
`;

export default function ClassNode({ id, data, selected }: ClassNodeProps) {
  const { t, i18n } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: 'EDIT_CLASS',
    targetOrganization: data.organizationIds,
  });
  const dispatch = useStoreDispatch();
  const { getNodes, getEdges } = useReactFlow();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const displayLang = useSelector(selectDisplayLang());
  const tools = useSelector(selectModelTools());
  const [hover, setHover] = useState(false);
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [associationModalVisible, setAssociationModalVisible] = useState(false);
  const [addReference, addReferenceResult] = useAddPropertyReferenceMutation();
  const classView = useSelector(selectClassView());
  const { setView } = useSetView();
  const { query } = useRouter();
  const [version] = useState(getSlugAsString(query.ver));

  const handleTitleClick = () => {
    if (globalSelected.id !== id) {
      setView('classes', 'info', id);
      dispatch(setSelected(id, 'classes', data.modelId));
    }
  };

  const handleHover = (hover: boolean) => {
    setHover(hover);
    if (hover) {
      dispatch(setHovered(id, 'classes'));
    } else {
      dispatch(resetHovered());
    }
  };

  const handleMenuFollowUp = (value: {
    uriData: UriData;
    type: ResourceType;
    mode: 'select' | 'create';
  }) => {
    if (!data.modelId) {
      return;
    }

    if (value.mode === 'select') {
      addReference({
        prefix: data.modelId,
        identifier: data.identifier,
        uri: value.uriData.uri,
        applicationProfile: data.applicationProfile ?? false,
      });
    } else {
      dispatch(setSelected(id, 'classes', data.modelId));
      dispatch(
        initializeResource(
          value.type,
          value.uriData,
          data.applicationProfile ?? false
        )
      );
      dispatch(setAddResourceRestrictionToClass(true));
    }
  };

  const handleResourceClick = (
    id: string,
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE,
    uri: string
  ) => {
    const resourceType =
      type === ResourceType.ASSOCIATION ? 'associations' : 'attributes';

    let version;
    let modelId = data.modelId;
    let resourceId = id;

    const parts = id.split(':');
    if (parts.length === 2) {
      modelId = parts[0];
      resourceId = parts[1];
      version = uri.match(/\/(\d\.\d\.\d)\//);
    }

    setView(resourceType, 'info', id);
    dispatch(
      setSelected(
        resourceId,
        resourceType,
        modelId,
        version ? version[1] : undefined
      )
    );
  };

  const handleResourceHover = (
    id: string,
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE,
    hide?: boolean
  ) => {
    if (hide && type === ResourceType.ASSOCIATION) {
      dispatch(resetHighlighted());
    }

    const targetEdge = getEdges().find((edge) => edge.data.identifier === id);

    if (type === ResourceType.ASSOCIATION && targetEdge) {
      dispatch(
        setHighlighted(getConnectedElements(targetEdge, getNodes(), getEdges()))
      );
    }
  };

  useEffect(() => {
    if (addReferenceResult.isSuccess) {
      dispatch(setUpdateVisualization(true));
      if (classView.info) {
        dispatch(setUpdateClassData(true));
      }
    }
  }, [
    addReferenceResult,
    classView.info,
    data.modelId,
    dispatch,
    globalSelected.id,
    globalSelected.type,
    id,
  ]);

  return (
    <ClassNodeDiv
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      $highlight={
        globalSelected.type === 'classes' &&
        globalSelected.id !== '' &&
        globalSelected.id === id
      }
      $hover={hover || globalHover.id === id}
      $appProfile={data.applicationProfile}
    >
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Bottom} id={id} />

      <div className="node-title">
        <div onClick={() => handleTitleClick()}>{renderClassLabel()}</div>

        {hasPermission && !version && (
          <>
            <NodeActionsMenu id={`${data.identifier}-options`}>
              <ActionMenuItem
                icon={<IconPlus />}
                onClick={() => setAttributeModalVisible(true)}
              >
                {translateResourceAddition(
                  ResourceType.ATTRIBUTE,
                  t,
                  data.applicationProfile
                )}
              </ActionMenuItem>
              <ActionMenuItem
                icon={<IconPlus />}
                onClick={() => setAssociationModalVisible(true)}
              >
                {translateResourceAddition(
                  ResourceType.ASSOCIATION,
                  t,
                  data.applicationProfile
                )}
              </ActionMenuItem>
            </NodeActionsMenu>
            <ResourceModal
              modelId={data.modelId}
              type={ResourceType.ATTRIBUTE}
              handleFollowUp={handleMenuFollowUp}
              limitSearchTo={'LIBRARY'}
              visible={attributeModalVisible}
              setVisible={setAttributeModalVisible}
              applicationProfile={data.applicationProfile}
              limitToSelect={!data.applicationProfile}
              hiddenResources={data.resources
                .filter((r) => r.type === ResourceType.ATTRIBUTE)
                .map((r) => r.uri)}
            />
            <ResourceModal
              modelId={data.modelId}
              type={ResourceType.ASSOCIATION}
              handleFollowUp={handleMenuFollowUp}
              limitSearchTo={'LIBRARY'}
              visible={associationModalVisible}
              setVisible={setAssociationModalVisible}
              applicationProfile={data.applicationProfile}
              limitToSelect={!data.applicationProfile}
              hiddenResources={data.resources
                .filter((r) => r.type === ResourceType.ASSOCIATION)
                .map((r) => r.uri)}
            />
          </>
        )}
      </div>

      {data.resources &&
        data.resources
          .filter((r) => {
            if (
              r.type === ResourceType.ATTRIBUTE &&
              ((data.applicationProfile && tools.showAttributeRestrictions) ||
                (!data.applicationProfile && tools.showAttributes))
            ) {
              return true;
            }

            if (
              r.type === ResourceType.ASSOCIATION &&
              ((data.applicationProfile && tools.showAssociationRestrictions) ||
                (!data.applicationProfile && tools.showAssociations))
            ) {
              return true;
            }

            return false;
          })
          .map((r) => (
            <Resource
              key={`${id}-child-${r.identifier}`}
              className="node-resource"
              onClick={() => handleResourceClick(r.identifier, r.type, r.uri)}
              $highlight={getResourceHighlighted(r.identifier, r.type)}
              onMouseEnter={() => handleResourceHover(r.identifier, r.type)}
              onMouseLeave={() =>
                handleResourceHover(r.identifier, r.type, true)
              }
            >
              {r.type === ResourceType.ASSOCIATION ? (
                <IconSwapVertical />
              ) : (
                <IconRows />
              )}

              {renderResourceLabel(r)}
            </Resource>
          ))}
    </ClassNodeDiv>
  );

  function getResourceHighlighted(
    id: string,
    type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE
  ) {
    if (
      (globalHover.id === id || globalSelected.id === id) &&
      type === ResourceType.ASSOCIATION &&
      (globalHover.type === 'associations' ||
        globalSelected.type === 'associations')
    ) {
      return true;
    }

    if (
      (globalHover.id === id ||
        globalSelected.id === id ||
        `${globalSelected.modelId}:${globalSelected.id}` === id) &&
      type === ResourceType.ATTRIBUTE &&
      (globalHover.type === 'attributes' ||
        globalSelected.type === 'attributes')
    ) {
      return true;
    }

    return false;
  }

  function renderClassLabel() {
    if (tools.showById) {
      return `${data.modelId}:${data.identifier}`;
    }

    if (!data.applicationProfile) {
      return getLanguageVersion({
        data: data.label,
        lang: displayLang !== i18n.language ? displayLang : i18n.language,
        appendLocale: true,
      });
    }

    return data.identifier.includes(':')
      ? data.identifier
      : `${getLanguageVersion({
          data: data.label,
          lang: displayLang !== i18n.language ? displayLang : i18n.language,
          appendLocale: true,
        })}
            ${' '}
        (${data.modelId}:${data.identifier})`;
  }

  function renderResourceLabel(
    resource: ClassNodeProps['data']['resources'][0]
  ) {
    const label = !tools.showById
      ? getLanguageVersion({
          data: resource.label,
          lang: displayLang !== i18n.language ? displayLang : i18n.language,
          appendLocale: true,
        })
      : resource.identifier.includes(':')
      ? resource.identifier
      : `${data.modelId}:${resource.identifier}`;

    const dataType =
      resource.dataType && resource.type === ResourceType.ATTRIBUTE
        ? `(${resource.dataType})`
        : '';

    if (!data.applicationProfile) {
      return `${label} ${dataType}`;
    } else {
      const codeListsText =
        resource.codeLists && resource.codeLists.length > 0
          ? `(+ ${t('codelist', { ns: 'admin' })})`
          : '';
      return (
        <div>
          {`${label} [${getMinMax(resource)}] ${dataType} ${codeListsText}`}
        </div>
      );
    }
  }

  function getMinMax(resource: ClassNodeProps['data']['resources'][0]) {
    if (!resource.minCount && !resource.maxCount) {
      return '*';
    }

    return `${resource.minCount ?? '0'}..${resource.maxCount ?? '*'}`;
  }
}
