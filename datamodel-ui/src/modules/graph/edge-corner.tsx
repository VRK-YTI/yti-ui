import { Handle, Position } from 'reactflow';

export default function EdgeCorner({ id }: { id: string }) {
  return (
    <div id="corner">
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Top} id={id} />
    </div>
  );
}
