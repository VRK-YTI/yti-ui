/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MouseEvent } from 'react';
import { EdgeProps, getStraightPath } from 'reactflow';
import styled from 'styled-components';

const EdgeContent = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-radius: 5px;
  display: flex;
  padding: 2px;
  width: min-content;

  button {
    border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    border-radius: 50%;
    background: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  button:first-child {
    margin-right: 3px;
  }
`;

export default function SplittableEdge({
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
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.handleDelete(id);
  };

  const onSplitClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    data.splitEdge(source, target, e.clientX, e.clientY);
  };

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      {selected && (
        <foreignObject
          width={49}
          height={26.5}
          x={labelX - 49 / 2}
          y={labelY - 26.5 / 2}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <EdgeContent>
            <button onClick={(e) => onSplitClick(e)}>/</button>
            <button onClick={(e) => onDeleteClick(e)}>×</button>
          </EdgeContent>
        </foreignObject>
      )}
    </>
  );
}
