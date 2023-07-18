/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  selectSelected,
  setSelected,
} from '@app/common/components/model/model.slice';
import { MouseEvent, useCallback } from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useStore,
} from 'reactflow';
import { DeleteEdgeButton, EdgeContent } from './edge.styles';
import { useSelector } from 'react-redux';
import { useStoreDispatch } from '@app/store';
import { getEdgeParams } from './utils';

export default function LabeledEdge({
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
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.handleDelete(id);
    if (globalSelected.id === id) {
      dispatch(setSelected('', 'associations'));
    }
  };

  const onSplitClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.splitEdge(source, target, e.clientX, e.clientY);
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
            <DeleteEdgeButton onClick={(e) => onDeleteClick(e)}>
              ×
            </DeleteEdgeButton>
          )}
          <div>
            <button onClick={(e) => onSplitClick(e)}>split</button>
          </div>
        </EdgeContent>
      </EdgeLabelRenderer>
    </>
  );
}
