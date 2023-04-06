/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { MouseEvent } from 'react';
import { EdgeLabelRenderer, EdgeProps, getStraightPath } from 'reactflow';
import { DeleteEdgeButton, EdgeContent } from './edge.styles';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';

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
  const globalSelected = useSelector(selectSelected());
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    data.handleDelete(id);
    if (globalSelected.id === id) {
      dispatch(setSelected('', 'associations'));
    }
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
          className="nopan"
          $labelX={labelX}
          $labelY={labelY}
          $highlight={
            globalSelected.type === 'associations' && globalSelected.id === id
          }
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
