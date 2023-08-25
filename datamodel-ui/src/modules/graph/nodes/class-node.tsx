/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  resetHovered,
  selectDisplayLang,
  selectHovered,
  selectModelTools,
  selectSelected,
  setHovered,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import {
  IconChevronDown,
  IconChevronUp,
  IconOptionsVertical,
  IconRows,
  IconSwapVertical,
  Tooltip,
} from 'suomifi-ui-components';
import {
  ClassNodeDiv,
  CollapseButton,
  OptionsButton,
  Resource,
  TooltipWrapper,
} from './node.styles';
import { useStoreDispatch } from '@app/store';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import HasPermission from '@app/common/utils/has-permission';
import { useAddNodeShapePropertyReferenceMutation } from '@app/common/components/class/class.slice';
import ResourceModal from '@app/modules/class-view/resource-modal';

interface ClassNodeProps {
  id: string;
  data: {
    identifier: string;
    label: { [key: string]: string };
    modelId?: string;
    resources?: {
      label: { [key: string]: string };
      identifier: string;
      type: ResourceType.ASSOCIATION | ResourceType.ATTRIBUTE;
    }[];
    resourceType?: 'association' | 'attribute';
    applicationProfile?: boolean;
    refetch?: () => void;
  };
  selected: boolean;
}

export default function ClassNode({ id, data, selected }: ClassNodeProps) {
  const { i18n } = useTranslation('common');
  const hasPermission = HasPermission({ actions: 'EDIT_CLASS' });
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const globalShowAttributes = useSelector(selectModelTools()).showAttributes;
  const displayLang = useSelector(selectDisplayLang());
  const [showAttributes, setShowAttributes] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hover, setHover] = useState(false);
  const [addReference, addReferenceResult] =
    useAddNodeShapePropertyReferenceMutation();

  const handleTitleClick = () => {
    if (globalSelected.id !== id) {
      dispatch(setSelected(id, 'classes'));
    }
  };

  const handleShowAttributesClick = () => {
    setShowAttributes(!showAttributes);
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
    label?: string;
    uri: string;
    type: ResourceType;
    mode: 'select' | 'create';
  }) => {
    if (!data.modelId) {
      return;
    }

    addReference({
      prefix: data.modelId,
      nodeshapeId: data.identifier,
      uri: value.uri,
    });
  };

  useEffect(() => {
    setShowAttributes(globalShowAttributes);
  }, [globalShowAttributes]);

  useEffect(() => {
    if (showTooltip && !selected) {
      setShowTooltip(false);
    }
  }, [selected, showTooltip]);

  useEffect(() => {
    if (addReferenceResult.isSuccess && data.refetch) {
      data.refetch();
    }
  }, [addReferenceResult, data]);

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
        <div onClick={() => handleTitleClick()}>
          {getLanguageVersion({
            data: data.label,
            lang: displayLang !== i18n.language ? displayLang : i18n.language,
            appendLocale: true,
          })}
        </div>
        {data.applicationProfile ? (
          hasPermission ? (
            <TooltipWrapper>
              <OptionsButton
                onClick={() => setShowTooltip(!showTooltip)}
                id={`${data.identifier}-options`}
              >
                <IconOptionsVertical fill="#2a6ebb" />
              </OptionsButton>

              <Tooltip
                ariaCloseButtonLabelText=""
                ariaToggleButtonLabelText=""
                open={showTooltip}
              >
                <ResourceModal
                  applicationProfile
                  modelId={'profile1'}
                  type={ResourceType.ATTRIBUTE}
                  handleFollowUp={handleMenuFollowUp}
                  limitSearchTo={'PROFILE'}
                  buttonIcon
                  limitToSelect
                />

                <ResourceModal
                  applicationProfile
                  modelId={'profile1'}
                  type={ResourceType.ASSOCIATION}
                  handleFollowUp={handleMenuFollowUp}
                  limitSearchTo={'PROFILE'}
                  buttonIcon
                  limitToSelect
                />
              </Tooltip>
            </TooltipWrapper>
          ) : (
            <></>
          )
        ) : (
          <CollapseButton onClick={() => handleShowAttributesClick()}>
            {showAttributes ? <IconChevronUp /> : <IconChevronDown />}
          </CollapseButton>
        )}
      </div>

      {showAttributes &&
        data.resources &&
        data.resources.map((r) => (
          <Resource
            key={`${id}-child-${r.identifier}`}
            className="node-resource"
            onClick={() => dispatch(setSelected(r.identifier, 'attributes'))}
            $highlight={
              globalSelected.type === 'attributes' &&
              globalSelected.id !== '' &&
              globalSelected.id === r.identifier
            }
          >
            {data.applicationProfile &&
              (r.type === ResourceType.ASSOCIATION ? (
                <IconSwapVertical />
              ) : (
                <IconRows />
              ))}

            {getLanguageVersion({
              data: r.label,
              lang: displayLang !== i18n.language ? displayLang : i18n.language,
              appendLocale: true,
            })}
          </Resource>
        ))}
    </ClassNodeDiv>
  );
}
