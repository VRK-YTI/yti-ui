/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  selectHovered,
  selectModelTools,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { IconChevronDown, IconChevronUp } from 'suomifi-ui-components';
import { Attribute, ClassNodeDiv } from './node.styles';
import { useStoreDispatch } from '@app/store';

interface ClassNodeProps {
  id: string;
  data: {
    label: string;
    resources?: {
      label: string;
      identifier: string;
    }[];
  };
  selected: boolean;
}

export default function ClassNode({ id, data }: ClassNodeProps) {
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const globalShowAttributes = useSelector(selectModelTools()).showAttributes;
  const [showAttributes, setShowAttributes] = useState(true);
  const [hover, setHover] = useState(false);

  const handleTitleClick = () => {
    if (globalSelected.id !== id) {
      dispatch(setSelected(id, 'classes'));
    }
  };

  const handleShowAttributesClick = () => {
    setShowAttributes(!showAttributes);
  };

  useEffect(() => {
    setShowAttributes(globalShowAttributes);
  }, [globalShowAttributes]);

  return (
    <ClassNodeDiv
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $highlight={
        globalSelected.type === 'classes' &&
        globalSelected.id !== '' &&
        globalSelected.id === id
      }
      $hover={hover || globalHover.id === id}
    >
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Bottom} id={id} />

      <div className="node-title">
        <div onClick={() => handleTitleClick()}>{data.label}</div>
        <button onClick={() => handleShowAttributesClick()}>
          {showAttributes ? <IconChevronUp /> : <IconChevronDown />}
        </button>
      </div>

      {showAttributes &&
        data.resources &&
        data.resources.map((r) => (
          <Attribute
            key={`${id}-child-${r.identifier}`}
            className="node-resource"
            onClick={() => dispatch(setSelected(r.identifier, 'attributes'))}
            $highlight={
              globalSelected.type === 'attributes' &&
              globalSelected.id !== '' &&
              globalSelected.id === r.identifier
            }
          >
            {r.label}
          </Attribute>
        ))}
    </ClassNodeDiv>
  );
}
