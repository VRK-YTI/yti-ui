import {
  resetActive,
  selectActive,
  setActive,
} from '@app/common/components/active/active.slice';
import { useStoreDispatch } from '@app/store';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { Icon } from 'suomifi-ui-components';
import { ClassNodeDiv } from './node.styles';

interface ClassNodeProps {
  id: string;
  data: {
    label: string;
    identifier: string;
    resources?: {
      label: string;
      identifier: string;
    }[];
  };
}

export default function ClassNode({ id, data }: ClassNodeProps) {
  const dispatch = useStoreDispatch();
  const actives = useSelector(selectActive());

  return (
    <ClassNodeDiv
      onMouseEnter={() => dispatch(setActive([id]))}
      onMouseLeave={() => dispatch(resetActive())}
      $highlight={actives.identifiers.includes(id)}
    >
      <Handle type="target" position={Position.Top} id={data.identifier} />
      <div className="node-title">
        <div>{data.label}</div>
        <Icon icon="chevronDown" />
      </div>
      <Handle type="source" position={Position.Bottom} id={data.identifier} />

      {data.resources &&
        data.resources.length > 0 &&
        data.resources.map((child) => (
          <div
            key={`${data.identifier}-child-${child.identifier}`}
            className="node-resource"
          >
            {child.label}
          </div>
        ))}
    </ClassNodeDiv>
  );
}
