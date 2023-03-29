/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  resetActive,
  setActive,
} from '@app/common/components/active/active.slice';
import { useStoreDispatch } from '@app/store';
import { EdgeLabelRenderer, getSmoothStepPath, EdgeProps } from 'reactflow';

export default function Edge({
  id,
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  label,
}: EdgeProps) {
  const dispatch = useStoreDispatch();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        <div
          onMouseEnter={() => dispatch(setActive([source, target]))}
          onMouseLeave={() => dispatch(resetActive())}
          style={{
            pointerEvents: 'all',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#FFFFFF',
            padding: '5px 10px',
            borderRadius: '2px',
            border: '1px solid #C8CDD0',
            fontSize: 16,
            fontWeight: 400,
          }}
          className="nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
