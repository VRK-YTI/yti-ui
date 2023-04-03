/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { setSelected } from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { MouseEvent, useEffect } from 'react';
import { EdgeLabelRenderer, EdgeProps, getStraightPath } from 'reactflow';
import { DeleteEdgeButton, EdgeContent } from './edge.styles';

export default function Edge({
  id,
  data,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  label,
  markerEnd,
  selected,
}: EdgeProps) {
  const dispatch = useStoreDispatch();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    data.handleDelete(id);
  };

  const handleMouseEnter = () => {
    return;
  };

  const handleMouseLeave = () => {
    return;
  };

  useEffect(() => {
    if (selected) {
      dispatch(setSelected(id, 'associations'));
    }
  }, [selected, dispatch, id]);

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <EdgeContent
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="nopan"
        >
          <div>{label}</div>
          {selected && (
            <DeleteEdgeButton onClick={(e) => onDeleteClick(e, id)}>
              ×
            </DeleteEdgeButton>
          )}
        </EdgeContent>
      </EdgeLabelRenderer>
    </>
  );
}
