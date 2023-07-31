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
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import {
  IconChevronDown,
  IconChevronUp,
  IconOptionsVertical,
} from 'suomifi-ui-components';
import { ClassNodeDiv, CollapseButton, OptionsButton } from './node.styles';
import { useStoreDispatch } from '@app/store';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import { useTranslation } from 'next-i18next';

interface ClassNodeProps {
  id: string;
  data: {
    identifier: string;
    label: { [key: string]: string };
    resourceType?: 'association' | 'attribute';
    applicationProfile?: boolean;
    toggleResourceVisibility: (value: boolean) => void;
  };
  selected: boolean;
}

export default function ClassNode({ id, data }: ClassNodeProps) {
  const { i18n } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const globalShowAttributes = useSelector(selectModelTools()).showAttributes;
  const displayLang = useSelector(selectDisplayLang());
  const [showAttributes, setShowAttributes] = useState(true);
  const [hover, setHover] = useState(false);

  const handleToggleResourceVisibility = useCallback(
    (value: boolean) => {
      data.toggleResourceVisibility(value);
    },
    [data]
  );

  const handleTitleClick = () => {
    if (globalSelected.id !== id) {
      dispatch(setSelected(id, 'classes'));
    }
  };

  const handleShowAttributesClick = () => {
    setShowAttributes(!showAttributes);
    data.toggleResourceVisibility(showAttributes);
  };

  const handleHover = (hover: boolean) => {
    setHover(hover);
    if (hover) {
      dispatch(setHovered(id, 'classes'));
    } else {
      dispatch(resetHovered());
    }
  };

  useEffect(() => {
    setShowAttributes(globalShowAttributes);
    handleToggleResourceVisibility(!globalShowAttributes);
  }, [globalShowAttributes, handleToggleResourceVisibility]);

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
          <OptionsButton>
            <IconOptionsVertical fill="#2a6ebb" />
          </OptionsButton>
        ) : (
          <CollapseButton onClick={() => handleShowAttributesClick()}>
            {showAttributes ? <IconChevronUp /> : <IconChevronDown />}
          </CollapseButton>
        )}
      </div>
    </ClassNodeDiv>
  );
}
