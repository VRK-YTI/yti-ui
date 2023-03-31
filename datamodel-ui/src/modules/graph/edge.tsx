/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  resetActive,
  setActive,
} from '@app/common/components/active/active.slice';
import { useStoreDispatch } from '@app/store';
import { MouseEvent } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath, EdgeProps } from 'reactflow';
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    data.handleDelete(id);
  };

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
          onMouseEnter={() => dispatch(setActive([source, target]))}
          onMouseLeave={() => dispatch(resetActive())}
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
