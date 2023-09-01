import { selectHighlighted } from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { CornerNodeWrapper } from './node.styles';

export default function CornerNode({ id }: { id: string }) {
  const highlighted = useSelector(selectHighlighted());

  return (
    <CornerNodeWrapper $highlight={highlighted.includes(id)}>
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Top} id={id} />
    </CornerNodeWrapper>
  );
}
