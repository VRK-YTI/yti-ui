import {
  selectHovered,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { Icon } from 'suomifi-ui-components';
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
  const [showAtttributes, setShowAttributes] = useState(true);
  const [hover, setHover] = useState(false);

  const mockAttributes = [
    {
      identifier: `${id}-attr-1`,
      label: 'Attribute #1',
    },
    {
      identifier: `${id}-attr-2`,
      label: 'Attribute #2',
    },
    {
      identifier: `${id}-attr-3`,
      label: 'Attribute #3',
    },
  ];

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
      <div className="node-title">
        <div>{data.label}</div>
        <button onClick={() => setShowAttributes(!showAtttributes)}>
          <Icon
            icon={showAtttributes ? 'chevronUp' : 'chevronDown'}
            variant="secondaryNoBorder"
          />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} id={id} />

      {showAtttributes &&
        mockAttributes.map((child) => (
          <Attribute
            key={`${id}-child-${child.identifier}`}
            className="node-resource"
            onClick={() => dispatch(setSelected('', 'attributes'))}
          >
            {child.label}
          </Attribute>
        ))}
    </ClassNodeDiv>
  );
}
