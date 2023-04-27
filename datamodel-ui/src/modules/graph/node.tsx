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
  const [showAttributes, setShowAttributes] = useState(true);
  const [hover, setHover] = useState(false);

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
        <button onClick={() => setShowAttributes(!showAttributes)}>
          <Icon
            icon={showAttributes ? 'chevronUp' : 'chevronDown'}
            variant="secondaryNoBorder"
          />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} id={id} />

      {showAttributes &&
        data.resources &&
        data.resources.map((r) => (
          <Attribute
            key={`${id}-child-${r.identifier}`}
            className="node-resource"
            onClick={() => dispatch(setSelected(r.identifier, 'attributes'))}
          >
            {r.label}
          </Attribute>
        ))}
    </ClassNodeDiv>
  );
}
