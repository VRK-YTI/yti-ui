/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { selectHighlighted } from '@app/common/components/model/model.slice';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { CornerNodeWrapper } from './node.styles';
import { IconClose } from 'suomifi-icons';

export default function CornerNode({
  id,
  selected,
  data,
}: {
  id: string;
  selected: boolean;
  data: {
    handleNodeDelete: (id: string) => void;
  };
}) {
  const highlighted = useSelector(selectHighlighted());

  return (
    <CornerNodeWrapper $highlight={highlighted.includes(id) || selected}>
      <Handle type="target" position={Position.Top} id={id} />
      <Handle type="source" position={Position.Top} id={id} />

      {selected && (
        <div
          className="delete-wrapper"
          onClick={() => data.handleNodeDelete(id)}
        >
          <IconClose />
        </div>
      )}
    </CornerNodeWrapper>
  );
}
