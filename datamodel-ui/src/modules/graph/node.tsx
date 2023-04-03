import {
  selectHovered,
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { useEffect, useState } from 'react';
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
  selected: boolean;
}

export default function ClassNode({ id, data, selected }: ClassNodeProps) {
  const dispatch = useStoreDispatch();
  const globalSelected = useSelector(selectSelected());
  const globalHover = useSelector(selectHovered());
  const [showAtttributes, setShowAttributes] = useState(false);
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

  useEffect(() => {
    if (selected) {
      dispatch(setSelected(id, 'classes'));
    }
  }, [dispatch, id, selected]);

  return (
    <ClassNodeDiv
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      $highlight={
        globalSelected.type === 'class' && globalSelected.id !== ''
          ? globalSelected.id === id
          : selected
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
