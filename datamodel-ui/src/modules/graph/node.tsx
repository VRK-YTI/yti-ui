import {
  selectActive,
  setActive,
} from '@app/common/components/active/active.slice';
import { useStoreDispatch } from '@app/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { Icon } from 'suomifi-ui-components';
import { ClassNodeDiv } from './node.styles';

interface ClassNodeProps {
  id: string;
  data: {
    label: string;
    resources?: {
      label: string;
      identifier: string;
    }[];
  };
}

export default function ClassNode({ id, data }: ClassNodeProps) {
  const dispatch = useStoreDispatch();
  const [highlight, setHighlight] = useState(false);
  const [showAtttributes, setShowAttributes] = useState(false);
  const actives = useSelector(selectActive());

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
      onMouseEnter={() => setHighlight(true)}
      onMouseLeave={() => setHighlight(false)}
      onClick={() => dispatch(setActive([id]))}
      $highlight={highlight || actives.identifiers.includes(id)}
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

      {/*
       * Using mock solution similar to the expected one
       * found below this piece of code.
       */}

      {showAtttributes &&
        mockAttributes.map((child) => (
          <div
            key={`${id}-child-${child.identifier}`}
            className="node-resource"
          >
            {child.label}
          </div>
        ))}

      {/* {data.resources &&
        data.resources.length > 0 &&
        data.resources.map((child) => (
          <div
            key={`${data.identifier}-child-${child.identifier}`}
            className="node-resource"
          >
            {child.label}
          </div>
        ))} */}
    </ClassNodeDiv>
  );
}
