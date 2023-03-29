import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Icon } from 'suomifi-ui-components';
import { ClassNodeDiv } from './node.styles';

interface ClassNodeProps {
  data: {
    label: string;
    identifier: string;
    resources?: {
      label: string;
      identifier: string;
    }[];
  };
}

export default function ClassNode({ data }: ClassNodeProps) {
  const [active, setActive] = useState(false);

  return (
    <ClassNodeDiv
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      $highlight={active}
    >
      <Handle type="target" position={Position.Top} id={data.identifier} />
      <div className="node-title">
        <div>Class node title {data.label}</div>
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
